'use client'

import { useEffect, useState } from 'react'
import PokemonCard from '@/components/PokemonCard'

interface Pokemon {
  id: number
  name: string
  image: string
  types: { id: number; name: string; image: string }[]
}

interface Type {
  id: number
  name: string
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // On récupère les pokémons 
  const fetchPokemons = async (reset: boolean = false) => {
    setLoading(true)
    try {
      let url = `https://nestjs-pokedex-api.vercel.app/pokemons?page=${page}&limit=${limit}`

      if (selectedType) {
        const selectedTypeObj = types.find((type) => type.name.toLowerCase() === selectedType.toLowerCase())
        if (selectedTypeObj) {
          url += `&types[]=${selectedTypeObj.id}`
        }
      }

      const response = await fetch(url)
      const data = await response.json()

      if (reset) {
        setPokemons(data)
      } else {
        setPokemons((prev) => [...prev, ...data])
      }

      if (data.length < limit) setHasMore(false)
      else setHasMore(true)
    } catch (error) {
      console.error('Error fetching pokemon:', error)
    }
    setLoading(false)
  }

  // Récupère les Types existants
  const fetchTypes = async () => {
    try {
      const response = await fetch(`https://nestjs-pokedex-api.vercel.app/types`)
      const data = await response.json()
      setTypes(data)
    } catch (error) {
      console.error('Error fetching types:', error)
    }
  }

  useEffect(() => {
    fetchPokemons(true)
    fetchTypes()
  }, [limit, page])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType
      ? pokemon.types.some((type) => type.name.toLowerCase() === selectedType.toLowerCase())
      : true
    return matchesSearch && matchesType
  })

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Panel du haut avec la recherche et les autres filtres */}
        <div className="mb-8 bg-red-500 rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Projet Pokédex React</h1>
          <div className="flex gap-4">
            <input
              type="search"
              placeholder="Rechercher un Pokémon"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                setPage(1) // Remet la page à 1 lors du changement de type
              }}
            >
              <option value="">Tous les types</option>
              {types.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1) // Remet la page à 1 lorsqu'on modifie la limite
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Tableau des Pokémon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              types={pokemon.types}
            />
          ))}
        </div>

        {/* Petit chargement si cela met du temps */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          </div>
        )}

        {/* Affiche un message quand il y a pas de résultats */}
        {filteredPokemons.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            Aucun Pokémon, le professeur Chen ne va pas être content...
          </div>
        )}
      </div>
    </main>
  )
}
