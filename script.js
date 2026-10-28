// ============================================================
// SITE DE CONSULTA (VIA REST API) - COM TIPO
// ============================================================
const FIREBASE_URL = 'https://presenciometro-escolar-default-rtdb.firebaseio.com';

// ============================================================
// FUNCAO: BUSCAR DADOS DO FIREBASE
// ============================================================
function consultarFirebaseREST() {
  const url = FIREBASE_URL + '/registros.json';
  return fetch(url)
    .then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function(data) {
      console.log('Dados recebidos:', data);
      return data;
    });
}

// ============================================================
// ELEMENTOS DOM
// ============================================================
const buscaInput = document.getElementById('buscaInput');
const consultarBtn = document.getElementById('consultarBtn');
const resultadoDiv = document.getElementById('resultado');

// ============================================================
// FUNCAO PRINCIPAL DE CONSULTA
// ============================================================
function consultarPresenca() {
  const termo = buscaInput.value.trim();

  if (!termo) {
    resultadoDiv.innerHTML = '<p class="aviso">Digite um nome ou codigo.</p>';
    return;
  }

  resultadoDiv.innerHTML = '<p class="info">Buscando registros...</p>';

  consultarFirebaseREST()
    .then(function(data) {
      if (!data) {
        resultadoDiv.innerHTML = '<div class="ausente"><p>Nenhum registro encontrado.</p></div>';
        return;
      }

      const registros = Object.values(data);
      
      if (registros.length === 0) {
        resultadoDiv.innerHTML = '<div class="ausente"><p>Nenhum registro encontrado.</p></div>';
        return;
      }

      const termoUpper = termo.toUpperCase();
      const encontrados = registros.filter(function(r) {
        return (r.nome && r.nome.toUpperCase().includes(termoUpper)) ||
               (r.uid && r.uid.toUpperCase().includes(termoUpper));
      });

      if (encontrados.length === 0) {
        resultadoDiv.innerHTML = '<div class="ausente"><p>Nenhum registro para <strong>' + termo + '</strong>.</p></div>';
      } else {
        var html = '<div class="presente"><p><strong>' + encontrados.length + '</strong> registro(s):</p></div><ul>';
        encontrados.forEach(function(r) {
          html += '<li>';
          html += '<span class="nome"> ' + (r.nome || 'Desconhecido') + '</span>';
          html += ' <span class="tipo" style="font-size:0.75rem;color:#888;">(' + (r.tipo || 'DESCONHECIDO') + ')</span>';
          html += ' <span class="uid"> ' + (r.uid || '---') + '</span>';
          html += ' <span class="hora"> ' + (r.data || '') + ' ' + (r.hora || '') + '</span>';
          html += '</li>';
        });
        html += '</ul>';
        resultadoDiv.innerHTML = html;
      }
    })
    .catch(function(err) {
      resultadoDiv.innerHTML = '<p class="erro">Erro ao consultar: ' + err.message + '</p>';
    });
}

// ============================================================
// EVENTOS
// ============================================================
consultarBtn.addEventListener('click', consultarPresenca);
buscaInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') consultarPresenca();
});

console.log('Site de consulta pronto!');
console.log('Gabriel - ALUNO (A3 77 2B 14)');
console.log('Paulo - FUNCIONARIO (E3 FB DF 2F)');