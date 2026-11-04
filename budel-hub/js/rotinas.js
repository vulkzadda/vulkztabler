/*
 * Rotinas mensais do Hub de Ferramentas do RH.
 * Para incluir, remover ou alterar uma rotina, edite esta lista.
 *
 *   id        identificador único (sem espaços; usado para guardar o status)
 *   categoria "Benefícios", "Folha" ou "Gestão" (uma categoria nova vira uma seção nova)
 *   nome      nome exibido no card
 *   descricao texto curto exibido no card
 *   dia       dia limite no mês (1 a 31; em meses mais curtos vira o último dia)
 *   icone     nome de um ícone do Tabler Icons (https://tabler.io/icons), sem o prefixo "ti-"
 *   link      endereço aberto pelo botão "Abrir" (planilha, pasta, sistema). "#" = ainda não definido
 *
 * Os dias limite e links abaixo são PROVISÓRIOS: confirme com a equipe.
 */
window.BUDEL_ROTINAS = [
  { id: 'rateio-amil', categoria: 'Benefícios', nome: 'Rateio AMIL', descricao: 'Rateio da fatura AMIL por centro de custo e filial.', dia: 5, icone: 'heart-plus', link: '#' },
  { id: 'rateio-unimed', categoria: 'Benefícios', nome: 'Rateio Unimed', descricao: 'Rateio da fatura Unimed por centro de custo e filial.', dia: 5, icone: 'heart-plus', link: '#' },
  { id: 'rateio-hapvida', categoria: 'Benefícios', nome: 'Rateio Hapvida', descricao: 'Rateio da fatura Hapvida por centro de custo e filial.', dia: 8, icone: 'heart-plus', link: '#' },
  { id: 'rateio-dental-uni', categoria: 'Benefícios', nome: 'Rateio Dental Uni', descricao: 'Rateio do plano odontológico Dental Uni.', dia: 8, icone: 'dental', link: '#' },
  { id: 'vr-plus', categoria: 'Benefícios', nome: 'VR Plus', descricao: 'Conferência e carga mensal do vale-refeição.', dia: 3, icone: 'tools-kitchen-2', link: '#' },
  { id: 'bonificacao-maxtrack', categoria: 'Benefícios', nome: 'Bonificação Maxtrack', descricao: 'Cálculo da bonificação a partir dos dados de telemetria.', dia: 10, icone: 'gift', link: '#' },
  { id: 'vale-transporte', categoria: 'Benefícios', nome: 'Vale-Transporte', descricao: 'Apuração e pedido mensal do vale-transporte.', dia: 2, icone: 'bus', link: '#' },
  { id: 'auditoria-pensao', categoria: 'Folha', nome: 'Auditoria de Pensão', descricao: 'Conferência dos descontos de pensão alimentícia na folha.', dia: 3, icone: 'scale', link: '#' },
  { id: 'coparticipacao-unimed', categoria: 'Folha', nome: 'Coparticipação Unimed', descricao: 'Lançamento dos descontos de coparticipação na folha.', dia: 12, icone: 'receipt', link: '#' },
  { id: 'organograma', categoria: 'Gestão', nome: 'Organograma', descricao: 'Atualização do organograma com movimentações do mês.', dia: 20, icone: 'sitemap', link: '#' },
  { id: 'one-page-rh', categoria: 'Gestão', nome: 'One Page RH', descricao: 'Resumo executivo mensal dos indicadores de pessoas.', dia: 25, icone: 'report-analytics', link: '#' }
];
