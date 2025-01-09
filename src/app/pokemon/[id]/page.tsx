'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const PokemonDetailsPage = () => {
  const params = useParams()
  const [id, setId] = useState<string | null>(null)
  const [pokemon, setPokemon] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }

    resolveParams()
  }, [params])

  useEffect(() => {
    if (id) {
      const fetchPokemonDetails = async () => {
        setLoading(true)
        try {
          const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`)
          const data = await response.json()
          setPokemon(data)
        } catch (error) {
          console.error('Erreur lors du chargement des données du Pokémon :', error)
        }
        setLoading(false)
      }

      fetchPokemonDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        Chargement...
      </div>
    )
  }

  if (!pokemon) {
    return <p className="text-center py-10">Ce pokémon est encore inconnu..</p>
  }

  const getStatLabel = (stat: string): string => {
    const labels: { [key: string]: string } = {
      HP: 'PV',
      speed: 'Vitesse',
      attack: 'Attaque',
      defense: 'Défense',
      specialAttack: 'Attaque spéciale',
      specialDefense: 'Défense spéciale',
    }
    return labels[stat] || ""
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={200}
            height={200}
            className="object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold capitalize">{pokemon.name}</h1>
            <p className="text-gray-500 mb-4">#{String(pokemon.id).padStart(3, '0')}</p>
            <div className="flex gap-2">
              {pokemon.types.map((type: any) => (
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

        {/* Statistiques du pokémon */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Statistiques</h2>
          {Object.entries(pokemon.stats)
          .filter(([key]) => getStatLabel(key))
          .map(([key, value]) => (
              <div key={key} className="mb-2">
                  <span className="capitalize">{getStatLabel(key)} : {typeof value === 'number' ? value : ''}</span>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                          className="bg-red-500 h-4 rounded-full"
                          style={{ width: `${value}%` }}
                      ></div>
                  </div>
              </div>
          ))}
        </div>

        {/* Évolutions possibles */}
        {pokemon.evolutions && pokemon.evolutions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Évolutions</h2>
            <div className="flex gap-4">
              {pokemon.evolutions.map((evo: any) => (
                <div key={evo.pokedexId} className="flex flex-col items-center">
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.pokedexId}.png`}
                    alt={evo.name}
                    width={100}
                    height={100}
                  />
                  <p className="capitalize">{evo.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" passHref>
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Revenir au Pokédex
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default PokemonDetailsPage
