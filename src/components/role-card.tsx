interface RoleCardProps {
  title: string
  description: string
  isSelected: boolean
  onClick: () => void
}

export function RoleCard({ title, description, isSelected, onClick }: RoleCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg cursor-pointer transition-all hover:shadow-md
        ${isSelected ? 'border-2 border-purple-500' : 'border border-gray-200'}
      `}
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

