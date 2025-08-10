import React, { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
// Removido import do Supabase - usando dados mock
import { Document as DocumentType } from '../types'
import { Upload, FileText, Download, Trash2, Eye, Calendar, User } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface DocumentsTabProps {
  patientId: string
  documents: DocumentType[]
  onDocumentAdded: () => void
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  patientId, 
  documents, 
  onDocumentAdded 
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [documentType, setDocumentType] = useState('')
  const [description, setDescription] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${patientId}/${uuidv4()}.${fileExt}`

        // Simulando upload do arquivo
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Simulando salvamento no banco de dados
        // Em um sistema real, aqui seria feito o upload para o storage
        console.log(`Arquivo ${file.name} simulado como enviado`)

        setUploadProgress(((i + 1) / selectedFiles.length) * 100)
      }

      setShowUploadModal(false)
      setSelectedFiles([])
      setDocumentType('')
      setDescription('')
      onDocumentAdded()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload dos arquivos. Tente novamente.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const downloadDocument = async (doc: DocumentType) => {
    try {
      // Simulando download do documento
      alert(`Download do documento "${doc.nome_arquivo}" seria iniciado aqui.`)
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
      alert('Erro ao baixar o documento.')
    }
  }

  const deleteDocument = async (doc: DocumentType) => {
    if (!confirm(`Tem certeza que deseja excluir o documento "${doc.nome_arquivo}"?`)) {
      return
    }

    try {
      // Simulando exclusão do documento
      await new Promise(resolve => setTimeout(resolve, 300))
      console.log(`Documento ${doc.nome_arquivo} simulado como excluído`)

      onDocumentAdded()
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
      alert('Erro ao deletar o documento.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return <FileText className="text-red-500" size={24} />
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" size={24} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Eye className="text-green-500" size={24} />
      default:
        return <FileText className="text-gray-500" size={24} />
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Documentos do Paciente</h3>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Upload size={16} className="mr-2" />
          Adicionar Documentos
        </button>
      </div>

      {/* Lista de documentos */}
      {documents.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700">Nenhum documento encontrado</h4>
          <p className="text-gray-500 mt-1">Adicione documentos como radiografias, exames e relatórios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col transition-shadow hover:shadow-lg">
              <div className="p-5 flex-grow">
                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0">{getFileIcon(doc.nome_arquivo)}</div>
                  <div className="ml-3 flex-grow min-w-0">
                    <h5 className="text-md font-bold text-gray-800 truncate" title={doc.nome_arquivo}>
                      {doc.nome_arquivo}
                    </h5>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {doc.tipo_documento || doc.tipo_arquivo}
                    </span>
                  </div>
                </div>
                
                {doc.descricao && (
                  <p className="text-sm text-gray-600 mb-3">
                    {doc.descricao}
                  </p>
                )}
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2" />
                    <span>{new Date(doc.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText size={14} className="mr-2" />
                    <span>{formatFileSize(doc.tamanho_arquivo || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => downloadDocument(doc)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Download size={14} className="mr-2" />
                    Baixar
                  </button>
                  <button 
                    onClick={() => deleteDocument(doc)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Upload com Tailwind */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl z-50 transform transition-all max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center" id="modal-title">
                <Upload size={20} className="mr-3 text-indigo-600" />
                Adicionar Novos Documentos
              </h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                <span className="sr-only">Fechar</span>
                <Trash2 size={20} className="transform rotate-45" />
              </button>
            </div>

            <div className="p-6 flex-grow overflow-y-auto space-y-6">
              {/* Dropzone */}
              <div 
                {...getRootProps()} 
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input {...getInputProps()} />
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                {isDragActive ? (
                  <p className="text-indigo-600 font-semibold">Solte os arquivos aqui...</p>
                ) : (
                  <p className="text-gray-600">Arraste e solte os arquivos ou <span className="text-indigo-600 font-semibold">clique para selecionar</span>.</p>
                )}
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX, JPG, PNG (tamanho máximo: 10MB)</p>
              </div>

              {/* Campos e Lista de Arquivos */}
              {selectedFiles.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                    <select 
                      id="documentType"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Radiografia">Radiografia</option>
                      <option value="Exame">Exame</option>
                      <option value="Relatório">Relatório</option>
                      <option value="Receita">Receita</option>
                      <option value="Atestado">Atestado</option>
                      <option value="Foto">Foto</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição <span className="text-gray-500">(Opcional)</span></label>
                    <textarea 
                      id="description"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Breve descrição sobre os arquivos..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Arquivos Selecionados ({selectedFiles.length})</h4>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200">
                          <div className="flex items-center min-w-0">
                            <div className="flex-shrink-0 mr-3">{getFileIcon(file.name)}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 ml-4"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Progresso do Upload */}
              {uploading && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">Enviando...</p>
                    <p className="text-sm font-medium text-indigo-600">{Math.round(uploadProgress)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end items-center space-x-4 flex-shrink-0">
              <button 
                type="button" 
                onClick={() => setShowUploadModal(false)} 
                disabled={uploading}
                className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={uploadFiles} 
                disabled={uploading || selectedFiles.length === 0}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  `Enviar Arquivos (${selectedFiles.length})`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentsTab