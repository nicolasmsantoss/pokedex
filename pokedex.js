let estadoPokedex = {
    digitando: false,
    buscando: false,
}

let numPokemon = '';
let idPokemon = 0;

const key1 = document.querySelector('#key-1');
const key2 = document.querySelector('#key-2');
const key3 = document.querySelector('#key-3');
const key4 = document.querySelector('#key-4');
const key5 = document.querySelector('#key-5');
const key6 = document.querySelector('#key-6');
const key7 = document.querySelector('#key-7');
const key8 = document.querySelector('#key-8');
const key9 = document.querySelector('#key-9');
const key10 = document.querySelector('#key-10');
const btnWhiteLeft = document.querySelector('#btn-white-left');
const btnWhiteRight = document.querySelector('#btn-white-right');
const btnUp = document.querySelector('#btn-up');
const btnDown = document.querySelector('#btn-down');
const btnLeft = document.querySelector('#btn-left');
const btnRight = document.querySelector('#btn-right');
const infoScreen = document.querySelector('#info-screen');
const mainScreen = document.querySelector('#main-screen');
const numberDisplay = document.querySelector('#number-display');

const regioes = {
    'generation-i': 'Kanto',
    'generation-ii': 'Johto',
    'generation-iii': 'Hoenn',
    'generation-iv': 'Sinnoh',
    'generation-v': 'Unova',
    'generation-vi': 'Kalos',
    'generation-vii': 'Alola',
    'generation-viii': 'Galar',
    'generation-ix': 'Paldea'
};

key1.addEventListener('click', () => leituraTeclado('1'));
key2.addEventListener('click', () => leituraTeclado('2'));
key3.addEventListener('click', () => leituraTeclado('3'));
key4.addEventListener('click', () => leituraTeclado('4'));
key5.addEventListener('click', () => leituraTeclado('5'));
key6.addEventListener('click', () => leituraTeclado('6'));
key7.addEventListener('click', () => leituraTeclado('7'));
key8.addEventListener('click', () => leituraTeclado('8'));
key9.addEventListener('click', () => leituraTeclado('9'));
key10.addEventListener('click', () => leituraTeclado('0'));
btnWhiteLeft.addEventListener('click', buscarPokemon);
btnWhiteRight.addEventListener('click', apagar);

btnRight.addEventListener('click', () => trocarPokemon(1));
btnLeft.addEventListener('click', () => trocarPokemon(-1));
btnUp.addEventListener('click', () => trocarPokemon(10));
btnDown.addEventListener('click', () => trocarPokemon(-10));

function leituraTeclado(tecla)
{
    if(estadoPokedex.buscando) return;

    if(!estadoPokedex.digitando)
    {
        numPokemon = '';
        infoScreen.textContent = '';
        estadoPokedex.digitando = true;
    }

    numPokemon += tecla;
    infoScreen.textContent = numPokemon;
}

function apagar()
{
    if(estadoPokedex.buscando) return;

    if(estadoPokedex.digitando)
    {
        numPokemon = numPokemon.slice(0, -1);
        if(numPokemon.length < 1)
        {
            estadoPokedex.digitando = false;
            infoScreen.textContent = 'Aguardando dados…';
        }
        else
        {
            infoScreen.textContent = numPokemon;
        }
    }
}

async function consultarApi(msg)
{
    if(estadoPokedex.buscando) return;

    const numero = Number(msg);
    if(isNaN(numero) || numero < 1)
    {
        mainScreen.textContent = 'Número inválido.';
        infoScreen.textContent = 'Digite um número maior que zero.';
        estadoPokedex.digitando = false;
        return;
    }

    estadoPokedex.buscando = true;
    infoScreen.textContent = 'Buscando...';

    try
    {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${numero}`);
        if(!response.ok)
        {
            throw new Error('Pokémon não encontrado.');
        }

        const data = await response.json();

        const responseEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.species.name}`);
        if(!responseEspecie.ok)
        {
            throw new Error('Não foi possível carregar a região.');
        }

        const especie = await responseEspecie.json();
        const urlImage = data.sprites.front_default;

        let tipos = '';
        for(let i = 0; i < data.types.length; i++)
        {
            tipos += data.types[i].type.name;
            if(i < data.types.length - 1)
            {
                tipos += ', ';
            }
        }

        let regiao = regioes[especie.generation.name];
        if(!regiao)
        {
            regiao = 'Desconhecida';
        }

        exibirSprite(urlImage);

        infoScreen.style.whiteSpace = 'pre-line';
        infoScreen.style.fontSize = 'calc(var(--unit) * .045)';
        infoScreen.style.lineHeight = '1.05';
        infoScreen.textContent = `${data.name.toUpperCase()}
Tipo(s): ${tipos}
Altura: ${data.height / 10} m | Peso: ${data.weight / 10} kg
Região: ${regiao}`;

        numberDisplay.textContent = '#' + String(data.id).padStart(3, '0');
        idPokemon = data.id;
        estadoPokedex.digitando = false;
    }
    catch(erro)
    {
        if(erro.message === 'Pokémon não encontrado.')
        {
            mainScreen.textContent = erro.message;
        }
        else
        {
            mainScreen.textContent = 'Erro ao acessar a API.';
        }

        infoScreen.textContent = 'Confira o número ou a conexão.';
        estadoPokedex.digitando = false;
    }

    estadoPokedex.buscando = false;
}

function buscarPokemon()
{
    if(estadoPokedex.digitando) consultarApi(numPokemon);
}

function trocarPokemon(valor)
{
    if(estadoPokedex.buscando) return;

    const proximo = idPokemon + valor;
    consultarApi(proximo);
}

function exibirSprite(urlImage)
{
    mainScreen.textContent = '';

    if(!urlImage)
    {
        mainScreen.textContent = 'Imagem indisponível.';
        return;
    }

    const img = document.createElement('img');
    img.src = urlImage;
    img.alt = 'Sprite frontal do Pokémon';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    mainScreen.appendChild(img);
}
