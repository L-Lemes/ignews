import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './style.module.scss'

export function SubscribeButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (status === 'authenticated') {
      router.push('/posts')
      return
    }
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data
      const stripe = await getStripeJs()
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(['pqp', err.message])
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}

// href="https://checkout.stripe.com/pay/cs_test_a1iXH8LbjX1vs6ffAou259FE0cn4vbehDFtVfLm1Nn3wTyFctmps7N7gW7#fidkdWxOYHwnPyd1blpxYHZxWjA0T3JLQ0NOY3V1cn1KXENqZnA0cmttR0RuMzVqSWhdTDFHTFxPTGdtUU1WVDQ2dEgwNTF1aEE2cX9cZ1VUYmREU2ZKTUd%2FS0JncT12bT1mMklUU31PN3ZxNTVnTkpwSVR3SicpJ3VpbGtuQH11anZgYUxhJz8ncWB2cVo0MW5iNTcxbU4zVGFnN0BkQEAneCUl"
