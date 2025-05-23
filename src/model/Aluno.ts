import {DatabaseModel} from "./DataBaseModel"

const database = new DatabaseModel().pool;

export class Aluno {
    private idAluno: number = 0;
    private nomeAluno: string;
    private cpf: string;
    private dataNascimento: Date;

    public constructor(_nomeAluno: string, _cpf: string, _dataNascimento: Date){
        this.nomeAluno = _nomeAluno;
        this.cpf = _cpf;
        this.dataNascimento = _dataNascimento
    }

    /* Métodos GET e SET */
    /**
     * Recupera o identificador do Aluno
     * @returns {number} O identificador do Aluno
     */
    public getIdAluno(): number {
        return this.idAluno;
    }

    /**
     * Define um novo identificador do Aluno
     * @param idAluno Novo identificador do Aluno
     */
    public setIdAluno(_idAluno: number): void {
        this.idAluno = _idAluno;
    }

    /**
     * Recupera o nome do Aluno
     * @returns {string} O nome do Aluno
     */
    public getNomeAluno(): string {
        return this.nomeAluno;
    }

    /**
     * Define um novo nome do Aluno
     * @param nomeAluno Novo nome do Aluno
     */
    public setNomeAluno(_nomeAluno: string): void {
        this.nomeAluno = _nomeAluno;
    }

    /**
     * Recupera o cpf do Aluno
     * @returns {string} O cpf do Aluno
     */
    public getCpf(): string {
        return this.cpf;
    }

    /**
     * Define um novo cpf do Aluno
     * @param cpf Novo cpf do Aluno
     */
    public setCpf(_cpf: string): void {
        this.cpf = _cpf;
    }

    /**
     * Recupera a data de nascimento do Aluno
     * @returns {date} A data de nascimento do Aluno
     */
    public getDataNascimento(): Date {
        return this.dataNascimento;
    }

    /**
     * Define uma nova data de nascimento do Aluno
     * @param dataNascimento Nova data de nascimento do Aluno
     */
    public setDataNascimento(_dataNascimento: Date): void {
        this.dataNascimento = _dataNascimento;
    }


    static async listagemAlunos(): Promise<Array<Aluno> | null> {

        const listaDeAlunos: Array<Aluno> = [];

        try {
            const querySelectAluno = `SELECT * FROM Aluno;`;
            const respostaBD = await database.query(querySelectAluno);

            respostaBD.rows.forEach((linha: any) => {
                const novoAluno = new Aluno(
                    linha.nome_aluno,
                    linha.cpf,
                    linha.data_nascimento
                );

                novoAluno.setIdAluno(linha.id_aluno);

                listaDeAlunos.push(novoAluno);
            });

            return listaDeAlunos;

        } catch (error) {
            console.log('Erro ao buscar lista de Alunos. Verifique os logs para mais detalhes.');
            console.log(error);
            return null; // Retorna null em caso de erro na consulta
        }
    }

    static async cadastroAluno(Aluno: Aluno): Promise<boolean> {
        try {
            const queryInsertAluno = `INSERT INTO Aluno (nome_aluno, cpf, data_nascimento)
                                      VALUES
                                      ('${Aluno.getNomeAluno()}', 
                                      '${Aluno.getCpf()}', 
                                      '${Aluno.getDataNascimento()}')
                                      RETURNING id_aluno;`;

            const respostaBD = await database.query(queryInsertAluno);

            if (respostaBD.rowCount !== 0) {
                console.log(`Aluno cadastrado com sucesso! ID do aluno: ${respostaBD.rows[0].id_aluno}`);
                return true; // Retorna true indicando sucesso no cadastro
            }

            return false; // Retorna false caso não tenha ocorrido a inserção

        } catch (error) {
            console.log('Erro ao cadastrar aluno. Verifique os logs para mais detalhes.');
            console.log(error);
            return false; // Retorna false em caso de erro
        }
    }

    static async atualizarCadastroAluno(Aluno: Aluno): Promise<boolean> {
        try {
            const queryUpdateAluno = `UPDATE Aluno SET
                                   nome_aluno = '${Aluno.getNomeAluno()}', 
                                   cpf = '${Aluno.getCpf()}', 
                                   data_nascimento = '${Aluno.getDataNascimento()}'
                                   WHERE id_aluno = ${Aluno.getIdAluno()};`;

            const respostaBD = await database.query(queryUpdateAluno);

            if (respostaBD.rowCount != 0) {
                console.log(`Aluno atualizado com sucesso! ID: ${Aluno.getIdAluno()}`);
                return true; // Retorna verdadeiro para indicar sucesso
            }
           
            return false; // Retorna falso se nenhum registro foi alterado (ID inexistente ou dados idênticos)

        } catch (error) {
            console.log(`Erro ao atualizar o cadastro do Aluno. Verifique os logs para mais detalhes.`);
            console.log(error);
            return false;  // Retorna falso em caso de falha na execução
        }
    }

    static async removerAluno(id_aluno: number): Promise<Boolean> {
        let queryResult = false;
        
        try {
            const queryDeleteAluno = `DELETE FROM Aluno WHERE id_aluno=${id_aluno};`;
        
            await database.query(queryDeleteAluno)
            .then((result) => {
                if (result.rowCount != 0) {
                    queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                }
            });
            
            return queryResult;// retorna o resultado da query
    
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;// retorna false
        }
    }
}