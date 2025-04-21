
import { useState } from "react";

const perguntas = [
  { id: 1, texto: "Você concorda com a emancipação da Área 8 para criação de um novo campo da COMEDEP?" },
  { id: 2, texto: "Você concorda que a Área 8 terá uma liderança própria?" },
  { id: 3, texto: "Você concorda com a separação administrativa da Área 8?" },
  { id: 4, texto: "Você concorda com a emancipação da Área 7 para criação de um novo campo da COMEDEP?" },
  { id: 5, texto: "Você concorda que a Área 7 terá uma liderança própria?" },
  { id: 6, texto: "Você concorda com a separação administrativa da Área 7?" },
];

const opcoes = ["Eu concordo", "Não concordo", "Abstenção"];

export default function SistemaVotacao() {
  const [liberado, setLiberado] = useState(false);
  const [votos, setVotos] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [resultados, setResultados] = useState(() => {
    const init = {};
    perguntas.forEach(p => {
      init[p.id] = { "Eu concordo": 0, "Não concordo": 0, "Abstenção": 0 };
    });
    return init;
  });

  function liberarCabine() {
    setLiberado(true);
    setEnviado(false);
    setVotos({});
  }

  function registrarVoto(perguntaId, valor) {
    setVotos(prev => ({ ...prev, [perguntaId]: valor }));
  }

  function enviarVotacao() {
    const novosResultados = { ...resultados };
    perguntas.forEach(p => {
      const voto = votos[p.id];
      if (voto) novosResultados[p.id][voto]++;
    });
    setResultados(novosResultados);
    setEnviado(true);
    setLiberado(false);
    setVotos({});
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Mesário</h2>
        <button
          onClick={liberarCabine}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Liberar cabine
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md col-span-2">
        <h2 className="text-xl font-bold mb-4">Cabine de Votação</h2>
        {!liberado && !enviado && <p>Aguardando liberação do mesário...</p>}

        {liberado && !enviado && (
          <form onSubmit={(e) => { e.preventDefault(); enviarVotacao(); }}>
            {perguntas.map(p => (
              <div key={p.id} className="mb-4">
                <p className="font-semibold mb-2">{p.texto}</p>
                {opcoes.map(op => (
                  <label key={op} className="block mb-1">
                    <input
                      type="radio"
                      name={`pergunta-${p.id}`}
                      value={op}
                      checked={votos[p.id] === op}
                      onChange={() => registrarVoto(p.id, op)}
                      className="mr-2"
                    />
                    {op}
                  </label>
                ))}
              </div>
            ))}
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Enviar Voto
            </button>
          </form>
        )}

        {enviado && <p className="text-green-600 font-semibold">Voto enviado com sucesso!</p>}
      </div>

      <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Acompanhamento em Tempo Real</h2>
        {perguntas.map(p => (
          <div key={p.id} className="mb-4">
            <p className="font-semibold mb-2">{p.texto}</p>
            <ul className="list-disc ml-6">
              {opcoes.map(op => (
                <li key={op}>{op}: {resultados[p.id][op]}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
