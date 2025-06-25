import { DatabaseModel } from "./DataBaseModel";

const database = new DatabaseModel().pool;

export class Usuario {
    private idUsuario: number = 0; 
    private uuidUsuario: string = ''; 
    private nomeUsuario: string;
    private senha: string = ''; 

    /**
     * Construtor da classe Usuario
     * 
     * @param _nome Nome do Usuário
     * @param _username Nome de usuário (login)
     * @param _email Endereço de e-mail do usuário
     */
    constructor(
        _nome: string,
        _senha: string
    ) {
        this.nomeUsuario = _nome;
        this.senha = _senha;
    }

    /**
     * Retorna o ID do usuário
     * @returns idUsuario Identificador único do usuário
     */
    public getIdUsuario(): number {
        return this.idUsuario;
    }

    /**
     * Atribui um valor ao ID do usuário
     * @param idUsuario Identificador único do usuário
     */
    public setIdUsuario(idUsuario: number): void {
        this.idUsuario = idUsuario;
    }

    /**
     * Retorna o UUID do usuário
     * @returns uuidUsuario Identificador único universal do usuário
     */
    public getUuidUsuario(): string {
        return this.uuidUsuario;
    }

    /**
     * Atribui um valor ao UUID do usuário
     * @param uuidUsuario Identificador único universal do usuário
     */
    public setUuidUsuario(uuidUsuario: string): void {
        this.uuidUsuario = uuidUsuario;
    }

    /**
     * Retorna o nome do usuário
     * @returns nome Nome do usuário
     */
    public getNomeUsuario(): string {
        return this.nomeUsuario;
    }

    /**
     * Atribui um valor ao nome do usuário
     * @param nome Nome do usuário
     */
    public setNomeUsuario(nomeUsuario: string): void {
        this.nomeUsuario = nomeUsuario;
    }

    /**
     * Retorna a senha do usuário
     * @returns senha Senha do usuário
     */
    public getSenha(): string {
        return this.senha;
    }

    /**
     * Atribui um valor à senha do usuário
     * @param senha Senha do usuário
     */
    public setSenha(senha: string): void {
        this.senha = senha;
    }

    /**
     * Retorna uma lista com todos os usuários cadastrados no banco de dados
     * @returns Lista com todos os usuários cadastrados ou null em caso de erro
     */
    static async listarUsuarios(): Promise<Array<Usuario> | null> {
        // Criando lista vazia para armzenar os usuários
        let listaDeUsuarios: Array<Usuario> = [];

        try {
            // Query para recuperar todos os usuários cadastrados
            const querySelectUsuarios = `SELECT * FROM Usuario`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(querySelectUsuarios);

            // Percorre os resultados da consulta
            respostaBD.rows.forEach((usuario) => {
                // Cria um novo objeto Usuario com os dados retornados
                let novoUsuario = new Usuario(
                    usuario.nomeUsuario,
                    usuario.senha
                );

                // Atribui os valores adicionais ao objeto
                novoUsuario.setIdUsuario(usuario.id_usuario);
                novoUsuario.setUuidUsuario(usuario.uuid)

                // Adiciona o usuário à lista
                listaDeUsuarios.push(novoUsuario);
            });

            // Retorna a lista de usuários
            return listaDeUsuarios;
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console e retorna null
            console.log(`Erro ao recuperar usuários. ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um usuário no banco de dados
     * 
     * @param usuario Usuário a ser cadastrado 
     * @returns o UUID do usuário cadastrado
     */
    static async cadastroUsuario(usuario: Usuario): Promise<string | null> {
        try {
            // Define a query SQL para inserir um novo usuário com nome, username, email e senha
            // A cláusula RETURNING uuid retorna o identificador gerado automaticamente pelo banco
            const query = `
          INSERT INTO usuario (nome_usuario, senha)
          VALUES ($1, $2)
          RETURNING uuid
        `;

            // Define os valores que serão usados na query (evita SQL Injection)
            const valores = [usuario.nomeUsuario, usuario.senha];

            // Executa a query no banco de dados e aguarda a resposta
            const resultado = await database.query(query, valores);

            // Obtém o uuid gerado pelo banco de dados a partir do resultado da query
            const uuid = resultado.rows[0].uuid;

            // Atribui o uuid ao objeto do usuário, caso precise ser usado depois
            usuario.uuidUsuario = uuid;

            // Retorna o uuid como confirmação do cadastro
            return uuid;
        } catch (error) {
            // Em caso de erro, exibe no console para ajudar na identificação do problema
            console.error('Erro ao salvar usuário:', error);

            // Retorna null para indicar que o cadastro não foi concluído
            return null;
        }
    }
}