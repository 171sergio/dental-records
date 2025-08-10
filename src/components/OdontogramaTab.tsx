import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
// Removido import do Supabase - usando dados mock
import { Procedure, ProcedureFormData } from '../types'
import { supabaseOperations } from '../services/supabaseOperations'
import { Plus, Calendar, FileText, History } from 'lucide-react'
import odontogramaImage from '../assets/odentograma_geometrico.jpg'

interface OdontogramaTabProps {
  patientId: string
  procedures: Procedure[]
  onProcedureAdded: () => void
}

// Mapeamento das posições dos dentes na imagem (valores aproximados em %)
const teethPositions = {
  // Arcada superior direita
  18: { top: 25, left: 15 },
  17: { top: 22, left: 20 },
  16: { top: 20, left: 25 },
  15: { top: 18, left: 30 },
  14: { top: 17, left: 35 },
  13: { top: 16, left: 40 },
  12: { top: 15, left: 45 },
  11: { top: 15, left: 50 },
  
  // Arcada superior esquerda
  21: { top: 15, left: 55 },
  22: { top: 15, left: 60 },
  23: { top: 16, left: 65 },
  24: { top: 17, left: 70 },
  25: { top: 18, left: 75 },
  26: { top: 20, left: 80 },
  27: { top: 22, left: 85 },
  28: { top: 25, left: 90 },
  
  // Arcada inferior direita
  48: { top: 75, left: 15 },
  47: { top: 78, left: 20 },
  46: { top: 80, left: 25 },
  45: { top: 82, left: 30 },
  44: { top: 83, left: 35 },
  43: { top: 84, left: 40 },
  42: { top: 85, left: 45 },
  41: { top: 85, left: 50 },
  
  // Arcada inferior esquerda
  31: { top: 85, left: 55 },
  32: { top: 85, left: 60 },
  33: { top: 84, left: 65 },
  34: { top: 83, left: 70 },
  35: { top: 82, left: 75 },
  36: { top: 80, left: 80 },
  37: { top: 78, left: 85 },
  38: { top: 75, left: 90 }
}

const OdontogramaTab: React.FC<OdontogramaTabProps> = ({ 
  patientId, 
  procedures, 
  onProcedureAdded 
}) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProcedureFormData>()

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber)
    setShowModal(true)
  }

  const onSubmit = async (data: ProcedureFormData) => {
    if (!selectedTooth) return

    setLoading(true)
    try {
      await supabaseOperations.createProcedure({
        paciente_id: patientId,
        dente_numero: selectedTooth,
        procedimento: data.procedimento,
        observacoes: data.observacoes,
        data_procedimento: data.data_procedimento
      })

      setShowModal(false)
      reset()
      onProcedureAdded()
      alert('Procedimento registrado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar procedimento:', error)
      alert('Erro ao registrar procedimento.')
    } finally {
      setLoading(false)
    }
  }

  const getToothProcedures = (toothNumber: number) => {
    return procedures.filter(proc => proc.dente_numero === toothNumber)
  }

  const hasToothProcedures = (toothNumber: number) => {
    return getToothProcedures(toothNumber).length > 0
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Odontograma Interativo</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            <span>Com procedimentos</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-300 rounded-full mr-2 border"></span>
            <span>Sem procedimentos</span>
          </div>
        </div>
      </div>

      {/* Container do odontograma */}
      <div className="text-center mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="relative inline-block w-full max-w-4xl mx-auto">
          <img 
            src={odontogramaImage} 
            alt="Odontograma" 
            className="w-full h-auto rounded-md"
          />
          
          {/* Overlays dos dentes */}
          {Object.entries(teethPositions).map(([toothNumber, position]) => {
            const toothNum = parseInt(toothNumber)
            const hasProcedures = hasToothProcedures(toothNum)
            
            return (
              <div
                key={toothNumber}
                className={`absolute w-5 h-5 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-150 ${hasProcedures ? 'bg-indigo-500/80' : 'bg-gray-400/60 hover:bg-indigo-400/80'}`}
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleToothClick(toothNum)}
                title={`Dente ${toothNumber}${hasProcedures ? ' (com procedimentos)' : ''}`}
              />
            )
          })}
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <strong className="font-bold">Como usar:</strong>
        <span className="block sm:inline ml-2">Clique em qualquer dente no odontograma para registrar um novo procedimento.</span>
      </div>

      {/* Lista de procedimentos recentes */}
      {procedures.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <History size={20} className="mr-2 text-indigo-600" />
            Histórico de Procedimentos
          </h4>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedimento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {procedures.slice(0, 10).map((procedure) => (
                  <tr key={procedure.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {procedure.dente_numero}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{procedure.procedimento}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(procedure.data_procedimento).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {procedure.observacoes || <span className="italic">N/A</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Procedimento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-16" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-50 transform transition-all">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center" id="modal-title">
                  <FileText size={20} className="mr-3 text-indigo-600" />
                  Registrar Procedimento no Dente {selectedTooth}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Fechar</span>
                  <Plus size={24} className="transform rotate-45" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna do Formulário */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="procedimento" className="block text-sm font-medium text-gray-700 mb-1">Procedimento Realizado *</label>
                    <input 
                      type="text" 
                      id="procedimento"
                      placeholder="Ex: Restauração, Limpeza..."
                      {...register('procedimento', { required: 'Procedimento é obrigatório' })}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.procedimento ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.procedimento && <p className="mt-1 text-sm text-red-600">{errors.procedimento.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="data_procedimento" className="block text-sm font-medium text-gray-700 mb-1">Data do Procedimento *</label>
                    <input 
                      type="date" 
                      id="data_procedimento"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      {...register('data_procedimento', { required: 'Data é obrigatória' })}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.data_procedimento ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.data_procedimento && <p className="mt-1 text-sm text-red-600">{errors.data_procedimento.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea 
                      id="observacoes"
                      rows={4}
                      placeholder="Observações adicionais..."
                      {...register('observacoes')}
                      className="block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                    ></textarea>
                  </div>
                </div>

                {/* Coluna do Histórico */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Histórico do Dente {selectedTooth}</h4>
                  {selectedTooth && getToothProcedures(selectedTooth).length > 0 ? (
                    <ul className="space-y-3">
                      {getToothProcedures(selectedTooth).map((proc) => (
                        <li key={proc.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800">{proc.procedimento}</p>
                            <p className="text-xs text-gray-500">{new Date(proc.data_procedimento).toLocaleDateString('pt-BR')}</p>
                          </div>
                          {proc.observacoes && <p className="text-sm text-gray-600 mt-1">{proc.observacoes}</p>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhum procedimento registrado para este dente.</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end items-center space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="mr-2" />
                      Adicionar Procedimento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OdontogramaTab