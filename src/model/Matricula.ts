import { DatabaseModel } from "./DataBaseModel";

const database = new DatabaseModel().pool;

export class Matricula {
    private idMatricula: number = 0; 
    private idAluno: number = 0;
    private idCurso: number = 0; 
    private dataMatricula: Date; 
    private statusMatricula: string = "aberta"; 

    constructor(
        idAluno: number,
        idCurso: number,
        dataMatricula: Date,
        statusMatricula: string
    ) {
        this.idAluno = idAluno;
        this.idCurso = idCurso;
        this.dataMatricula = dataMatricula;
        this.statusMatricula = statusMatricula
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador de Matricula
     * @returns {number} O identificador de Matricula
     */
    public getIdMatricula(): number {
        return this.idMatricula;
    }

    /**
     * Define um novo identificador para Matricula
     * @param idMatricula Novo identificador de Matricula
     */
    public setIdMatricula(idMatricula: number): void {
        this.idMatricula = idMatricula;
    }

    /**
     * Recupera o identificador de Aluno
     * @returns {number} O identificador de Aluno
     */
    public getIdAluno(): number {
        return this.idAluno;
    }

    /**
     * Define um novo identificador para Aluno
     * @param idAluno Novo identificador de Aluno
     */
    public setIdAluno(idAluno: number): void {
        this.idAluno = idAluno;
    }

    /**
     * Recupera o identificador de Cursos
     * @returns {number} O identificador de Cursos
     */
    public getIdCurso(): number {
        return this.idCurso;
    }

    /**
     * Define um novo identificador para Curso
     * @param idCurso Novo identificador de Curso
     */
    public setIdCurso(idCurso: number): void {
        this.idCurso = idCurso;
    }

    /**
     * Recupera a data da Matricula
     * @returns {Date} A data da Matricula
     */
    public getDataMatricula(): Date {
        return this.dataMatricula; 
    }

    /**
     * Define uma nova data da Matricula
     * @param dataMatricula Nova data da Matricula
     */
    public setDataMatricula(dataMatricula: Date): void {
        this.dataMatricula = dataMatricula;
    }

    /**
    * Retorna o status da Matricula
    * @returns status: status Matricula
    */
    public getStatusMatricula(): string {
    return this.statusMatricula;
    }
    
    /**
    * Atribui o parâmetro ao atributo statusMatricula
    * 
    * @param _statusMatricula : status do Matricula
    */
    public setStatusMatricula(_statusMatricula: string) {
    this.statusMatricula = _statusMatricula;
    }

 
    static async listagemMatricula(): Promise<Array<Matricula> | null> {
        let listaDeMatriculas: Array<any> = [];
    
        try {
            const querySelectMatricula = `
                SELECT m.id_matricula, m.id_aluno, m.id_curso,
                       m.data_matricula, m.status_matricula,
                       a.nome_aluno, a.cpf, a.data_nascimento, 
                       c.nome_curso, c.categoria, c.carga_horaria
                FROM Matricula m
                JOIN Aluno a ON m.id_aluno = a.id_aluno
                JOIN Curso c ON m.id_curso = c.id_curso;`;

            const respostaBD = await database.query(querySelectMatricula);
    
            if (respostaBD.rows.length === 0) {
                return null;
            }
    
            respostaBD.rows.forEach((linha: any) => {
                const Matricula = {
                    idMatricula: linha.id_matricula,
                    idAluno: linha.id_aluno,
                    idCurso: linha.id_curso,
                    dataMatricula: linha.data_matricula,
                    statusMatricula: linha.status_matricula,
                    aluno: {
                        nomeAluno: linha.nome_aluno,
                        cpf: linha.cpf,
                        dataNascimento: linha.data_nascimento,
                        statusAluno: linha.status_aluno
                    },
                    curso: {
                        nomeCurso: linha.nome_curso,
                        categoria: linha.categoria,
                        cargaHoraria: linha.carga_horaria,
                        statusCurso: linha.status_curso
                    }
                };
    
                listaDeMatriculas.push(Matricula);
            });
    
            return listaDeMatriculas;
    
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    } 
    
    static async cadastroMatricula(Matricula: Matricula): Promise<boolean> {    
        try {    
            const queryInsertMatricula = `INSERT INTO Matricula (id_aluno, id_curso, data_matricula, status_matricula)
                                          VALUES 
                                          ($1, $2, $3, $4)
                                          RETURNING id_matricula;`;

            const respostaBD = await database.query(queryInsertMatricula, [
                Matricula.getIdAluno(),
                Matricula.getIdCurso(),
                Matricula.getDataMatricula(),
                Matricula.getStatusMatricula()
            ]);

            if (respostaBD.rowCount !== 0) {
                console.log(`Matricula cadastrada com sucesso! ID da matricula: ${respostaBD.rows[0].id_Matricula}`);
                return true; // Retorna true indicando sucesso no cadastro de novos Matricula
            }
    
            return false; // Retorna false caso não tenha ocorrido a inserção
    
        } catch (error) {     
            console.log('Erro ao cadastrar matricula. Verifique os logs para mais detalhes.');    
            console.log(error);    
            return false; // Retorna false em caso de erro
        }
    }

    static async atualizarCadastroMatricula(Matricula: Matricula): Promise<boolean> {
        try {
            const queryUpdateMatricula = `UPDATE Matricula SET
                                    id_aluno = '${Matricula.getIdAluno()}', 
                                    id_curso = '${Matricula.getIdCurso()}', 
                                    data_matricula = '${Matricula.getDataMatricula()}',
                                    status_matricula = '${Matricula.getStatusMatricula()}'
                                    WHERE id_matricula = ${Matricula.getIdMatricula()};`;
    
            const respostaBD = await database.query(queryUpdateMatricula);
    
            if (respostaBD.rowCount != 0) {
                console.log(`Matricula atualizada com sucesso! ID: ${Matricula.getIdMatricula()}`);
                return true; // Retorna verdadeiro para indicar sucesso
            }
            return false;
        } catch (error) {
            console.log(`Erro ao atualizar o cadastro da matricula. Verifique os logs para mais detalhes.`);
            console.log(error);
            return false; // Retorna falso em caso de falha na execução
        }
    }

    static async removerMatricula(id_Matricula: number): Promise<boolean> {
        let queryResult = false;

        try {
            const queryDeleteMatricula = `UPDATE Matricula
                                            SET status_matricula = 'fechada'
                                            WHERE id_matricula = ${id_Matricula}`;
            const respostaBD = await database.query(queryDeleteMatricula);

            if(respostaBD.rowCount !=0) {
                console.log('Matricula removido com sucesso!');
                queryResult = true;
            }

            return queryResult

        } catch (error) {
            console.log(`Erro ao remover matricula: ${error}`);
            return queryResult;
        }
    }
}