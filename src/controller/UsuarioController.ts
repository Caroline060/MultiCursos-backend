import { Usuario } from "../model/Usuario"; 
import { Request, Response } from "express";

interface UsuarioDTO {
    nomeUsuario: string;    // Nome completo do usuário
    senha: string;          // Senha de acesso
}

class UsuarioController extends Usuario {

    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const UsuarioRecebido: UsuarioDTO = req.body;
    
            const novoUsuario = new Usuario(UsuarioRecebido.nomeUsuario, 
                                            UsuarioRecebido.senha
                                           );
    
            console.log(novoUsuario);
    
            const repostaClasse = await Usuario.cadastroUsuario(novoUsuario);
    
            if(repostaClasse) {
                return res.status(200).json({ mensagem: "Usuario cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar o Usuario. Entre em contato com o administrador do sistema."});
            } 
    
            } catch (error) {
                console.log(`Erro ao cadastrar um Usuario. ${error}`);
    
                return res.status(400).json({ mensagem: "Não foi possível cadastrar o Usuario. Entre em contato com o administrador do sistema." });
        }
    }    
    
  
    static async todos(req: Request, res: Response) {
        try {
            const listaDeUsuarios = await Usuario.listarUsuarios();

            res.status(200).json(listaDeUsuarios);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);

            res.status(400).json("Erro ao recuperar as informações do Usuario");
        }
    }

}

export default UsuarioController;