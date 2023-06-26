import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/PokemonDetail.module.css';

const PokemonDetail = ({ pokemon }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{pokemon.name} - Pokédex</title>
      </Head>

      <div className={styles.pokemonDetail}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          alt={pokemon.name}
        />
        <p className={styles.label}>ID: {id}</p>
        <p className={styles.label}>Name: {pokemon.name}</p>
        <p className={styles.label}>Height: {pokemon.height}</p>
        <p className={styles.label}>Weight: {pokemon.weight}</p>
        <p className={styles.label}>Types:</p>
        <ul className={styles.typeList}>
          {pokemon.types.map((type) => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </ul>
      </div>

      <a href="/" className={styles.goBackButton}>
        Go Back
      </a>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  const data = await response.json();

  return {
    props: {
      pokemon: data,
    },
  };
}

export default PokemonDetail;
