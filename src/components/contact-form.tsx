'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!response.ok) throw new Error('Failed to send message')

      setSuccess('Your message has been sent. I will get back to you as soon as possible.')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (error: unknown) {
      setError((error as Error).message || 'An error occurred while sending your message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-accent-warm/20 bg-accent-warm/5 rounded-xl">
          <CheckCircle2 className="h-4 w-4 text-accent-warm" />
          <AlertDescription className="text-accent-warm">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your project or idea..."
            rows={5}
            required
            className="resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading font-semibold w-full sm:w-auto shadow-lg shadow-accent-warm/15 hover:shadow-accent-warm/25 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
