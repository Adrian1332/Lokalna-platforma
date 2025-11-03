import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Auth.scss'
import { motion } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/') // po udanej rejestracji idziemy na stronę główną
    } catch (err) {
      // możesz tu zrobić coś ładniejszego, ale na start uczciwy komunikat wystarczy
      setError('Nie udało się utworzyć konta. Sprawdź email / hasło.')
    }
  }

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło (min 6 znaków)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Zarejestruj się</button>
      </form>
      <p className="auth-alt">
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </motion.div>
  )
}

export default Register
