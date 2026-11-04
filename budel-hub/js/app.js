(function () {
  'use strict';

  var ROTINAS = window.BUDEL_ROTINAS || [];
  var MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  var DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var DIAS_CAL = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  var STORAGE_PREFIX = 'budel-hub:concluidas:';

  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  var state = {
    ano: hoje.getFullYear(),
    mes: hoje.getMonth(), // 0-11
    busca: ''
  };

  var $ = function (id) {
    return document.getElementById(id);
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) {
    return String(n).padStart(2, '0');
  }
  function norm(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
  function chaveMes() {
    return state.ano + '-' + pad(state.mes + 1);
  }
  function diasNoMes() {
    return new Date(state.ano, state.mes + 1, 0).getDate();
  }

  // Status concluído é guardado por mês, no navegador de quem usa.
  function lerConcluidas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PREFIX + chaveMes()) || '{}');
    } catch (e) {
      return {};
    }
  }
  function salvarConcluidas(obj) {
    try {
      localStorage.setItem(STORAGE_PREFIX + chaveMes(), JSON.stringify(obj));
    } catch (e) {
      /* armazenamento indisponível: o status vale só até recarregar */
    }
  }
  var memoria = {};
  function concluidas() {
    var k = chaveMes();
    if (!memoria[k]) memoria[k] = lerConcluidas();
    return memoria[k];
  }
  function alternar(id) {
    var c = concluidas();
    if (c[id]) delete c[id];
    else c[id] = new Date().toISOString();
    salvarConcluidas(c);
    render();
  }

  function rotinasDoMes() {
    var c = concluidas();
    var ultimo = diasNoMes();
    return ROTINAS.map(function (r) {
      var dia = Math.min(r.dia, ultimo);
      var prazo = new Date(state.ano, state.mes, dia);
      var feito = !!c[r.id];
      var atrasado = !feito && prazo < hoje;
      var status = feito ? 'done' : atrasado ? 'late' : 'pending';
      return {
        r: r,
        dia: dia,
        semana: DIAS[prazo.getDay()],
        status: status
      };
    });
  }

  var STATUS = {
    done: { label: 'Concluído', cls: 'status-green', dot: 'is-done', text: 'text-success' },
    pending: { label: 'Pendente', cls: 'status-yellow', dot: 'is-pending', text: 'text-warning' },
    late: { label: 'Atrasado', cls: 'status-red', dot: 'is-late', text: 'text-danger' }
  };

  function renderResumo(lista) {
    var total = lista.length;
    var feitas = lista.filter(function (x) { return x.status === 'done'; }).length;
    var atrasadas = lista.filter(function (x) { return x.status === 'late'; }).length;
    var pct = total ? Math.round((feitas / total) * 100) : 0;
    $('stat-total').textContent = total;
    $('stat-done').textContent = feitas;
    $('stat-pending').textContent = total - feitas - atrasadas;
    $('stat-late').textContent = atrasadas;
    $('stat-pct').textContent = pct;
    $('stat-bar').style.width = pct + '%';
    $('stat-progress').setAttribute('aria-valuenow', pct);
  }

  function cardHtml(x) {
    var r = x.r;
    var s = STATUS[x.status];
    var temLink = r.link && r.link !== '#';
    return (
      '<div class="col-md-6 col-xxl-4">' +
      '<div class="card budel-routine h-100">' +
      (x.status === 'late' ? '<div class="card-status-top bg-danger"></div>' : '') +
      '<div class="card-body d-flex flex-column gap-2">' +
      '<div class="d-flex align-items-start justify-content-between gap-2">' +
      '<span class="avatar budel-icon"><i class="ti ti-' + esc(r.icone || 'file') + '"></i></span>' +
      '<span class="status ' + s.cls + '"><span class="status-dot"></span>' + s.label + '</span>' +
      '</div>' +
      '<div><h3 class="card-title mb-1">' + esc(r.nome) + '</h3>' +
      '<p class="text-secondary mb-0">' + esc(r.descricao) + '</p></div>' +
      '<div class="mt-auto d-flex align-items-center gap-1 text-secondary"><i class="ti ti-calendar"></i>' +
      'Dia limite: <strong class="text-body">' + pad(x.dia) + '/' + pad(state.mes + 1) + ' (' + x.semana + ')</strong></div>' +
      '</div>' +
      '<div class="card-footer d-flex gap-2">' +
      (temLink
        ? '<a class="btn btn-dark flex-fill" href="' + esc(r.link) + '" target="_blank" rel="noopener"><i class="ti ti-external-link me-1"></i>Abrir</a>'
        : '<button type="button" class="btn btn-dark flex-fill" disabled title="Link ainda não configurado em js/rotinas.js"><i class="ti ti-external-link me-1"></i>Abrir</button>') +
      (x.status === 'done'
        ? '<button type="button" class="btn btn-outline-secondary flex-fill" data-toggle-id="' + esc(r.id) + '"><i class="ti ti-arrow-back-up me-1"></i>Desfazer</button>'
        : '<button type="button" class="btn btn-outline-primary flex-fill" data-toggle-id="' + esc(r.id) + '"><i class="ti ti-check me-1"></i>Marcar como feito</button>') +
      '</div></div></div>'
    );
  }

  function renderGrupos(lista) {
    var termo = norm(state.busca.trim());
    var visiveis = termo
      ? lista.filter(function (x) { return norm(x.r.nome + ' ' + x.r.categoria + ' ' + x.r.descricao).indexOf(termo) !== -1; })
      : lista;
    var categorias = [];
    lista.forEach(function (x) {
      if (categorias.indexOf(x.r.categoria) === -1) categorias.push(x.r.categoria);
    });
    var html = categorias
      .map(function (cat) {
        var doGrupo = lista.filter(function (x) { return x.r.categoria === cat; });
        var itens = visiveis.filter(function (x) { return x.r.categoria === cat; });
        if (!itens.length) return '';
        var feitas = doGrupo.filter(function (x) { return x.status === 'done'; }).length;
        return (
          '<section class="budel-group">' +
          '<div class="budel-group-head"><h2>' + esc(cat) + '</h2>' +
          '<span class="text-secondary">' + feitas + ' de ' + doGrupo.length + ' concluídas</span></div>' +
          '<div class="row row-cards">' + itens.map(cardHtml).join('') + '</div>' +
          '</section>'
        );
      })
      .join('');
    $('groups').innerHTML = html;
    $('empty').classList.toggle('d-none', !!html);
  }

  function renderCalendario(lista) {
    var html = DIAS_CAL.map(function (d) { return '<div class="budel-cal-wd">' + d + '</div>'; }).join('');
    var inicio = new Date(state.ano, state.mes, 1).getDay();
    var total = diasNoMes();
    var celulas = Math.ceil((inicio + total) / 7) * 7;
    for (var i = 0; i < celulas; i++) {
      var dia = i - inicio + 1;
      if (dia < 1 || dia > total) {
        html += '<div class="budel-cal-day is-empty"></div>';
        continue;
      }
      var itens = lista.filter(function (x) { return x.dia === dia; });
      var dataDia = new Date(state.ano, state.mes, dia);
      var cls = ['budel-cal-day'];
      if (dataDia.getDay() === 0 || dataDia.getDay() === 6) cls.push('is-weekend');
      if (itens.length) cls.push('has-items');
      if (dataDia.getTime() === hoje.getTime()) cls.push('is-today');
      var titulo = itens.map(function (x) { return x.r.nome + ' (' + STATUS[x.status].label + ')'; }).join(', ');
      html +=
        '<div class="' + cls.join(' ') + '"' + (titulo ? ' title="' + esc(titulo) + '"' : '') + '>' +
        '<span>' + dia + '</span>' +
        '<span class="budel-cal-dots">' +
        itens.map(function (x) { return '<span class="budel-dot ' + STATUS[x.status].dot + '"></span>'; }).join('') +
        '</span></div>';
    }
    $('calendar').innerHTML = html;
  }

  function renderAgenda(lista) {
    var dias = [];
    lista.forEach(function (x) {
      if (dias.indexOf(x.dia) === -1) dias.push(x.dia);
    });
    dias.sort(function (a, b) { return a - b; });
    $('agenda').innerHTML = dias
      .map(function (d) {
        var itens = lista.filter(function (x) { return x.dia === d; });
        return (
          '<div class="list-group-item d-flex gap-3">' +
          '<div class="budel-agenda-day"><strong>' + pad(d) + '</strong><span>' + itens[0].semana + '</span></div>' +
          '<div class="flex-fill d-flex flex-column gap-1">' +
          itens
            .map(function (x) {
              var s = STATUS[x.status];
              return (
                '<div class="d-flex align-items-center justify-content-between gap-2">' +
                '<span class="d-inline-flex align-items-center gap-2"><span class="budel-dot ' + s.dot + '"></span>' + esc(x.r.nome) + '</span>' +
                '<span class="small fw-bold ' + s.text + '">' + s.label + '</span></div>'
              );
            })
            .join('') +
          '</div></div>'
        );
      })
      .join('');
  }

  function render() {
    var lista = rotinasDoMes();
    var rotulo = MESES[state.mes] + ' de ' + state.ano;
    $('ref-label').textContent = rotulo;
    $('cal-title').textContent = rotulo;
    renderResumo(lista);
    renderGrupos(lista);
    renderCalendario(lista);
    renderAgenda(lista);
  }

  function montarSeletorMes() {
    var sel = $('month-select');
    var html = '';
    // 6 meses para trás e 2 para frente
    for (var k = -6; k <= 2; k++) {
      var d = new Date(hoje.getFullYear(), hoje.getMonth() + k, 1);
      var v = d.getFullYear() + '-' + d.getMonth();
      html += '<option value="' + v + '"' + (k === 0 ? ' selected' : '') + '>' + MESES[d.getMonth()] + ' de ' + d.getFullYear() + '</option>';
    }
    sel.innerHTML = html;
    sel.addEventListener('change', function () {
      var p = sel.value.split('-');
      state.ano = Number(p[0]);
      state.mes = Number(p[1]);
      render();
    });
  }

  function iniciar() {
    $('today-label').textContent = pad(hoje.getDate()) + '/' + pad(hoje.getMonth() + 1) + '/' + hoje.getFullYear();
    $('year').textContent = hoje.getFullYear();
    montarSeletorMes();

    var busca = $('search');
    busca.addEventListener('input', function () {
      state.busca = busca.value;
      var lista = rotinasDoMes();
      renderGrupos(lista);
    });

    // Atalho Ctrl+K (ou Cmd+K) foca a busca; Esc limpa
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        busca.focus();
        busca.select();
      } else if (e.key === 'Escape' && document.activeElement === busca && busca.value) {
        busca.value = '';
        state.busca = '';
        renderGrupos(rotinasDoMes());
      }
    });

    $('groups').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-toggle-id]');
      if (btn) alternar(btn.getAttribute('data-toggle-id'));
    });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
