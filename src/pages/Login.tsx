import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, User, Lock, Stethoscope, UserPlus, LogIn } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        // Validações para registro
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem')
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres')
        }
        if (!name.trim()) {
          throw new Error('Nome é obrigatório')
        }
        
        await signUp(email, password, name)
        setError('')
        alert('Conta criada com sucesso! Verifique seu email para confirmar a conta.')
        setIsSignUp(false)
      } else {
        await signIn(email, password)
        // O redirecionamento será feito automaticamente pelo App.tsx
      }
    } catch (err: any) {
      setError(err.message || 'Erro na operação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md animate-slide-in-up">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
          {/* Logo e título */}
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500 mb-4 border border-primary-600 shadow-lg">
              <Stethoscope size={44} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Clínica Odontológica</h2>
            <p className="text-gray-600 mt-2">Sistema de Prontuário Eletrônico</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg p-3 mb-4 animate-shake" role="alert">
                {error}
              </div>
            )}

            {/* Campo Nome (apenas no cadastro) */}
            {isSignUp && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  required={isSignUp}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:bg-white transition-all duration-300"
                />
              </div>
            )}

            {/* Campo Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:bg-white transition-all duration-300"
              />
            </div>

            {/* Campo Senha */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:bg-white transition-all duration-300 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Senha (apenas no cadastro) */}
            {isSignUp && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    required={isSignUp}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:bg-white transition-all duration-300 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Botão de submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-primary-500/50 transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
                    ) : (
                      isSignUp ? 'Criar Conta' : 'Entrar'
                    )}
            </button>

            {/* Toggle entre login e cadastro */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                <button
                  type="button"
                  className="font-medium text-primary-600 hover:text-primary-800 transition-colors"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                    setEmail('')
                    setPassword('')
                    setName('')
                    setConfirmPassword('')
                  }}
                  disabled={loading}
                >
                  {isSignUp ? 'Faça login' : 'Crie uma conta'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login