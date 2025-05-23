import {Request, Response} from "express";
import {Aluno} from "../model/Aluno";

interface AlunoDTO {
    idAluno: number,
    nomeAluno: string,
    cpf: string,
    dataNascimento: Date
}

export class AlunoController extends Aluno {

    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeAlunos = await Aluno.listagemAlunos();

            return res.status(200).json(listaDeAlunos);
            
        } catch (error) {
            console.log('Erro ao acessar listagem de alunos');

            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de alunos" });
        }
    }

    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const AlunoRecebido: AlunoDTO = req.body;

            const novoAluno = new Aluno(AlunoRecebido.nomeAluno,                
                                        AlunoRecebido.cpf,
                                        AlunoRecebido.dataNascimento ?? new Date("1900-01-01")
                                       );

            console.log(novoAluno);

            const repostaClasse = await Aluno.cadastroAluno(novoAluno);

            if(repostaClasse) {
                return res.status(200).json({ mensagem: "Aluno cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar o aluno. Entre em contato com o administrador do sistema."});
            } 

        } catch (error) {
            console.log(`Erro ao cadastrar um aluno. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível cadastrar o aluno. Entre em contato com o administrador do sistema." });
        }
    }    

    static async atualizar (req:Request, res:Response): Promise<any> {
        try {
            const AlunoRecebido: AlunoDTO = req.body;
            const AlunoAtualizado = new Aluno(
                AlunoRecebido.nomeAluno,
                AlunoRecebido.cpf,
                AlunoRecebido.dataNascimento ?? new Date("1900-01-01")
            );

            AlunoAtualizado.setIdAluno(parseInt(req.query.idAluno as string));

            const respostaModelo = await Aluno.atualizarCadastroAluno(AlunoAtualizado);

            if (respostaModelo) {
                return res.status(200).json({mensagem: "Aluno atualizado com sucesso!"});
            } else {
                return res.status(400).json({mensagem: "Não foi possível atualizar o cadastro do aluno. Entre em contato com o administrador do sistema."})
            }
            
        } catch (error) {
            console.log(`Erro ao atualizar um aluno. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar o aluno. Entre em contato com o administrador do sistema." });
        }
    }

    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idAluno = parseInt(req.query.idAluno as string);
            const result = await Aluno.removerAluno(idAluno);
                
            if (result) {
                return res.status(200).json('Aluno removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar aluno');
            }

        } catch (error) {
            console.log("Erro ao remover o aluno");
            console.log(error);
            return res.status(500).send("error");
        }
    }
}

export default AlunoController;