import { Handler } from '@netlify/functions'
import Imap from 'imap'
import { simpleParser } from 'mailparser'
import nodemailer from 'nodemailer'

interface EmailConfig {
  email: string
  appPassword: string
  imapServer: string
  imapPort: number
  smtpServer: string
  smtpPort: number
}

interface EmailMessage {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  read: boolean
  body?: string
}

// Fetch emails from IMAP
async function fetchEmails(config: EmailConfig): Promise<EmailMessage[]> {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: config.email,
      password: config.appPassword,
      host: config.imapServer,
      port: config.imapPort,
      tls: true
    })

    const emails: EmailMessage[] = []

    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        reject(err)
        return
      }

      // Fetch last 20 emails
      imap.search(['ALL'], (err, results) => {
        if (err) {
          reject(err)
          return
        }

        if (results.length === 0) {
          imap.end()
          resolve([])
          return
        }

        const f = imap.fetch(results.slice(-20), { bodies: '' })

        f.on('message', (msg, seqno) => {
          let emailData: Partial<EmailMessage> = {
            id: String(seqno),
            read: false
          }

          msg.on('attributes', (attrs) => {
            emailData.read = !attrs.flags.includes('\\Unseen')
          })

          msg.on('structure', (structure) => {
            // Parse email structure if needed
          })

          simpleParser(msg, async (err, parsed) => {
            if (err) {
              console.error('Parse error:', err)
              return
            }

            emailData.from = parsed.from?.text || 'Unknown'
            emailData.subject = parsed.subject || '(No Subject)'
            emailData.preview = parsed.text?.substring(0, 100) || parsed.html?.substring(0, 100) || ''
            emailData.body = parsed.text || parsed.html || ''
            emailData.date = parsed.date?.toISOString() || new Date().toISOString()

            emails.push(emailData as EmailMessage)

            // When all emails are processed
            if (emails.length === results.slice(-20).length) {
              imap.end()
              resolve(emails)
            }
          })
        })

        f.on('error', reject)
        f.on('end', () => {
          if (emails.length === 0) {
            imap.end()
            resolve([])
          }
        })
      })
    })

    imap.on('error', reject)
    imap.on('end', () => {})
  })
}

// Send email via SMTP
async function sendEmail(
  config: EmailConfig,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    host: config.smtpServer,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: {
      user: config.email,
      pass: config.appPassword
    }
  })

  try {
    await transporter.sendMail({
      from: config.email,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    })
    return true
  } catch (error) {
    console.error('SMTP error:', error)
    throw error
  }
}

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { action, config, to, subject, body: emailBody } = body

    // Validate config
    if (!config?.email || !config?.appPassword || !config?.imapServer || !config?.smtpServer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email configuration' })
      }
    }

    // Fetch emails
    if (action === 'fetch') {
      try {
        const emails = await fetchEmails(config as EmailConfig)
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, emails })
        }
      } catch (err) {
        console.error('Fetch error:', err)
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: err instanceof Error ? err.message : 'Failed to fetch emails'
          })
        }
      }
    }

    // Send email
    if (action === 'send') {
      if (!to || !subject || !emailBody) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing email details (to, subject, body)' })
        }
      }

      try {
        await sendEmail(config as EmailConfig, to, subject, emailBody)
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: 'Email sent successfully' })
        }
      } catch (err) {
        console.error('Send error:', err)
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: err instanceof Error ? err.message : 'Failed to send email'
          })
        }
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action. Use "fetch" or "send".' })
    }
  } catch (err) {
    console.error('Handler error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error'
      })
    }
  }
}

export { handler }
