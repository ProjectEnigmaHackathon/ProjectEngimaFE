import React from 'react'
import { GitBranch, Info, CheckCircle, AlertTriangle } from 'lucide-react'

interface BranchNamingHelperProps {
  sprintName: string
  fixVersion: string
  releaseType: 'release' | 'hotfix'
}

const BranchNamingHelper: React.FC<BranchNamingHelperProps> = ({ 
  sprintName, 
  fixVersion, 
  releaseType: _releaseType
}) => {
  const generateExampleBranches = () => {
    const examples = {
      feature: sprintName ? `feature/PROJ-123-${sprintName}` : 'feature/PROJ-123-description',
      sprint: sprintName || 'sprint-2024-01',
      release: fixVersion ? `release/${fixVersion}` : 'release/v2.1.0',
      rollback: fixVersion ? `rollback/v-${fixVersion}` : 'rollback/v-2.1.0'
    }
    
    return examples
  }

  const examples = generateExampleBranches()
  
  const validateBranchName = (name: string, type: string) => {
    const patterns = {
      feature: /^feature\/[A-Z]+-\d+/,
      sprint: /^sprint-\d{4}-\d{2}$/,
      release: /^release\/v\d+\.\d+\.\d+$/,
      rollback: /^rollback\/v-\d+\.\d+\.\d+$/
    }
    
    return patterns[type as keyof typeof patterns]?.test(name) || false
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <GitBranch size={14} className="text-blue-600" />
        <h4 className="text-sm font-medium text-blue-800">Branch Naming Conventions</h4>
        <Info size={12} className="text-blue-500" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <span className="font-medium text-gray-700">Feature Branch:</span>
              <div className="text-gray-600 font-mono">{examples.feature}</div>
            </div>
            {validateBranchName(examples.feature, 'feature') ? (
              <CheckCircle size={12} className="text-green-500" />
            ) : (
              <AlertTriangle size={12} className="text-amber-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <span className="font-medium text-gray-700">Sprint Branch:</span>
              <div className="text-gray-600 font-mono">{examples.sprint}</div>
            </div>
            {validateBranchName(examples.sprint, 'sprint') ? (
              <CheckCircle size={12} className="text-green-500" />
            ) : (
              <AlertTriangle size={12} className="text-amber-500" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <span className="font-medium text-gray-700">Release Branch:</span>
              <div className="text-gray-600 font-mono">{examples.release}</div>
            </div>
            {validateBranchName(examples.release, 'release') ? (
              <CheckCircle size={12} className="text-green-500" />
            ) : (
              <AlertTriangle size={12} className="text-amber-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <span className="font-medium text-gray-700">Rollback Branch:</span>
              <div className="text-gray-600 font-mono">{examples.rollback}</div>
            </div>
            {validateBranchName(examples.rollback, 'rollback') ? (
              <CheckCircle size={12} className="text-green-500" />
            ) : (
              <AlertTriangle size={12} className="text-amber-500" />
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Expected Pattern:</strong> The system will look for feature branches matching 
          <code className="bg-blue-100 px-1 rounded mx-1">feature/TICKET-ID</code> 
          and merge them into your sprint branch 
          <code className="bg-blue-100 px-1 rounded mx-1">{examples.sprint}</code>
        </p>
      </div>
    </div>
  )
}

export default BranchNamingHelper 