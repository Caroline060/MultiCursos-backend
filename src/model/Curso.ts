import {DatabaseModel} from "./DataBaseModel"

const database = new DatabaseModel().pool;

export class Curso {
    private idCurso: number = 0;
    private nomeCurso: string;
    private categoria: string;
    private cargaHoraria: number;

    public constructor(_nomeCurso: string, _categoria: string, _cargaHoraria: number){
        this.nomeCurso = _nomeCurso;
        this.categoria = _categoria;
        this.cargaHoraria = _cargaHoraria;
    }

    /* Métodos GET e SET */
    /**
     * Recupera o identificador do Curso
     * @returns {number} O identificador do Curso
     */
    public getIdCurso(): number {
        return this.idCurso;
    }

    /**
     * Define um novo identificador do Curso
     * @param idCurso Novo identificador do Curso
     */
    public setIdCurso(_idCurso: number): void {
        this.idCurso = _idCurso;
    }

    /**
     * Recupera o nome do Curso
     * @returns {string} O nome do Curso
     */
    public getNomeCurso(): string {
        return this.nomeCurso;
    }

    /**
     * Define um novo nome do Curso
     * @param nomeCurso Novo nome do Curso
     */
    public setNomeCurso(_nomeCurso: string): void {
        this.nomeCurso = _nomeCurso;
    }

    /**
     * Recupera o Categoria do Curso
     * @returns {string} O Categoria do Curso
     */
    public getCategoria(): string {
        return this.categoria;
    }

    /**
     * Define um novo Categoria do Curso
     * @param categoria Novo Categoria do Curso
     */
    public setCategoria(_categoria: string): void {
        this.categoria = _categoria;
    }

    /**
     * Recupera a data de nascimento do Curso
     * @returns {number} A data de nascimento do Curso
     */
    public getCargaHoraria(): number {
        return this.cargaHoraria;
    }

    /**
     * Define uma nova data de nascimento do Curso
     * @param cargaHoraria Nova data de nascimento do Curso
     */
    public setCargaHoraria(_cargaHoraria: number): void {
        this.cargaHoraria = _cargaHoraria;
    }


    static async listagemCursos(): Promise<Array<Curso> | null> {

        const listaDeCursos: Array<Curso> = [];

        try {
            const querySelectCurso = `SELECT * FROM Curso;`;
            const respostaBD = await database.query(querySelectCurso);

            respostaBD.rows.forEach((linha: any) => {
                const novoCurso = new Curso(
                    linha.nome_curso,
                    linha.categoria,
                    linha.carga_horaria
                );

                novoCurso.setIdCurso(linha.id_curso);

                listaDeCursos.push(novoCurso);
            });

            return listaDeCursos;

        } catch (error) {
            console.log('Erro ao buscar lista de Cursos. Verifique os logs para mais detalhes.');
            console.log(error);
            return null; // Retorna null em caso de erro na consulta
        }
    }

    static async cadastroCurso(Curso: Curso): Promise<boolean> {
        try {
            const queryInsertCurso = `INSERT INTO Curso (nome_curso, categoria, carga_horaria)
                                      VALUES
                                      ('${Curso.getNomeCurso()}', 
                                      '${Curso.getCategoria()}', 
                                      '${Curso.getCargaHoraria()}')
                                      RETURNING id_curso;`;

            const respostaBD = await database.query(queryInsertCurso);

            if (respostaBD.rowCount !== 0) {
                console.log(`Curso cadastrado com sucesso! ID do curso: ${respostaBD.rows[0].id_curso}`);
                return true; // Retorna true indicando sucesso no cadastro
            }

            return false; // Retorna false caso não tenha ocorrido a inserção

        } catch (error) {
            console.log('Erro ao cadastrar curso. Verifique os logs para mais detalhes.');
            console.log(error);
            return false; // Retorna false em caso de erro
        }
    }

    static async atualizarCadastroCurso(Curso: Curso): Promise<boolean> {
        try {
            const queryUpdateCurso = `UPDATE Curso SET
                                   nome_curso = '${Curso.getNomeCurso()}', 
                                   categoria = '${Curso.getCategoria()}', 
                                   carga_horaria= '${Curso.getCargaHoraria()}'
                                   WHERE id_curso = ${Curso.getIdCurso()};`;

            const respostaBD = await database.query(queryUpdateCurso);

            if (respostaBD.rowCount != 0) {
                console.log(`Curso atualizado com sucesso! ID: ${Curso.getIdCurso()}`);
                return true; // Retorna verdadeiro para indicar sucesso
            }
           
            return false; // Retorna falso se nenhum registro foi alterado (ID inexistente ou dados idênticos)

        } catch (error) {
            console.log(`Erro ao atualizar o cadastro do curso. Verifique os logs para mais detalhes.`);
            console.log(error);
            return false;  // Retorna falso em caso de falha na execução
        }
    }

    static async removerCurso(id_Curso: number): Promise<Boolean> {
        let queryResult = false;
        
        try {
            const queryDeleteCurso = `DELETE FROM Curso WHERE id_curso=${id_Curso};`;
        
            await database.query(queryDeleteCurso)
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