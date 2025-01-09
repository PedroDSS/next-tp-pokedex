import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface PokemonCardProps {
    id: number
    name: string
    image: string
    types: { id: number; name: string; image: string }[]
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, image, types }) => {
    const router = useRouter()

    const handlePokemonClick = () => {
        router.push(`/pokemon/${id}`)
    }
    return (
        <div 
            onClick={handlePokemonClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
            <div className="p-4">
                <div className="relative w-full h-32 mb-2">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain"
                        priority={id <= 20}
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">#{String(id).padStart(3, '0')}</p>
                    <h2 className="font-semibold text-lg capitalize mb-2">{name}</h2>
                    <div className="flex gap-2 justify-center">
                        {types.map((type) => (
                            <span key={type.id} className="flex items-center gap-1">
                                <Image
                                    src={type.image}
                                    alt={type.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                                <span className="text-sm text-gray-700">{type.name}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PokemonCard
