export interface QuizQuestion {
    question: string
    options: string[]
    correct: number
}

export const quizzes: Record<string, QuizQuestion[]> = {
    'modulo-1-esocial': [
        {
            question: 'Qual decreto instituiu o eSocial no Brasil?',
            options: [
                'Decreto nº 8.373/2014',
                'Decreto nº 7.602/2011',
                'Decreto nº 10.854/2021',
                'Decreto nº 9.579/2018',
            ],
            correct: 0,
        },
        {
            question: 'Quais são os três eventos do eSocial voltados à SST?',
            options: [
                'S-1000, S-1200, S-1210',
                'S-2210, S-2220, S-2240',
                'S-2200, S-2205, S-2206',
                'S-2299, S-2300, S-2306',
            ],
            correct: 1,
        },
        {
            question: 'Qual é o principal objetivo do eSocial na área de SST?',
            options: [
                'Substituir todas as NRs',
                'Eliminar a necessidade de médico do trabalho',
                'Unificar o envio de informações trabalhistas, previdenciárias e fiscais',
                'Reduzir o número de funcionários das empresas',
            ],
            correct: 2,
        },
    ],
    'modulo-2-s2210': [
        {
            question: 'Qual o prazo para envio do S-2210 após um acidente de trabalho com óbito?',
            options: ['Até 24 horas', 'Até 48 horas', 'Até 5 dias úteis', 'No mesmo dia'],
            correct: 0,
        },
        {
            question: 'O S-2210 substitui qual documento físico?',
            options: ['ASO', 'CAT física', 'LTCAT', 'PPP'],
            correct: 1,
        },
        {
            question: 'Doença profissional é considerada acidente de trabalho pelo eSocial?',
            options: [
                'Não, apenas acidentes típicos',
                'Sim, conforme Lei 8.213/91',
                'Depende do setor',
                'Apenas para empresas de alto risco',
            ],
            correct: 1,
        },
    ],
    'modulo-3-s2220': [
        {
            question: 'Qual o prazo para envio do S-2220?',
            options: [
                'No mesmo dia do exame',
                'Até 5 dias úteis',
                'Até o dia 15 do mês seguinte à realização do exame',
                'Até 30 dias após o exame',
            ],
            correct: 2,
        },
        {
            question: 'Qual tabela do eSocial está vinculada ao evento S-2220?',
            options: ['Tabela 24', 'Tabela 27', 'Tabela 06', 'Tabela 09'],
            correct: 1,
        },
        {
            question: 'Quais exames NÃO fazem parte do monitoramento de saúde ocupacional?',
            options: [
                'Admissional e demissional',
                'Periódico e de retorno ao trabalho',
                'Exames estéticos',
                'Mudança de risco ocupacional',
            ],
            correct: 2,
        },
    ],
    'modulo-4-s2240': [
        {
            question: 'Qual tabela do eSocial lista os agentes nocivos para o S-2240?',
            options: ['Tabela 27', 'Tabela 06', 'Tabela 24', 'Tabela 09'],
            correct: 2,
        },
        {
            question: 'Quais tipos de agentes nocivos devem ser informados no S-2240?',
            options: [
                'Apenas químicos',
                'Químicos, físicos, biológicos e ergonômicos',
                'Apenas biológicos',
                'Apenas físicos e químicos',
            ],
            correct: 1,
        },
        {
            question: 'O que deve ser informado junto com o agente nocivo no S-2240?',
            options: [
                'Apenas o nome do agente',
                'EPI/EPC utilizados e responsável técnico',
                'Apenas o código da NR',
                'O salário do trabalhador exposto',
            ],
            correct: 1,
        },
    ],
    'modulo-5-conclusao': [
        {
            question: 'Qual é a principal consequência do não envio dos eventos de SST no eSocial?',
            options: [
                'Nenhuma consequência',
                'Multas e penalidades para a empresa',
                'Aumento salarial obrigatório',
                'Redução de jornada de trabalho',
            ],
            correct: 1,
        },
        {
            question: 'Qual dos itens abaixo é uma boa prática para o Técnico em SST?',
            options: [
                'Enviar os eventos apenas uma vez por ano',
                'Manter atualizado o cronograma de exames e monitoramento',
                'Ignorar acidentes de trajeto',
                'Delegar a responsabilidade do eSocial ao RH',
            ],
            correct: 1,
        },
        {
            question: 'O certificado T&S Cursos é emitido quando o aluno:',
            options: [
                'Se inscreve no curso',
                'Conclui o primeiro módulo',
                'Conclui todos os 5 módulos e acerta os quizzes',
                'Paga o valor do curso',
            ],
            correct: 2,
        },
    ],
}
