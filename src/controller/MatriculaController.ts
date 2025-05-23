import { Request, Response } from "express";
import { Matricula } from "../model/Matricula";

interface MatriculaDTO {    
    idMatricula: number,
    idAluno: number,
    idCurso: number,
    dataMatricula: Date,
    statusMatricula: string
}

export class MatriculaController extends Matricula {

    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeMatricula = await Matricula.listagemMatricula();

            return res.status(200).json(listaDeMatricula);
        } catch (error) {
            console.log('Erro ao acessar listagem de matriculas');

            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de matriculas" });
        }
    }

    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const MatriculaRecebido: MatriculaDTO = req.body;
    
            const novoMatricula = new Matricula(MatriculaRecebido.idAluno,
                                    MatriculaRecebido.idCurso,
                                    MatriculaRecebido.dataMatricula,
                                    MatriculaRecebido.statusMatricula);
                    
            console.log(novoMatricula);
            
            const repostaClasse = await Matricula.cadastroMatricula(novoMatricula);
        
            if(repostaClasse) {
                return res.status(200).json({ mensagem: "Matricula cadastrada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar a matricula. Entre em contato com o administrador do sistema."});
            }
        } catch (error) {
            console.log(`Erro ao cadastrar um Matricula. ${error}`);
        
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a matricula. Entre em contato com o administrador do sistema." });
        }    
    }

    static async atualizar (req:Request, res:Response): Promise<any> {
        try {
            const MatriculaRecebido: MatriculaDTO = req.body;
            const MatriculaAtualizado = new Matricula(
                MatriculaRecebido.idAluno,
                MatriculaRecebido.idCurso,
                MatriculaRecebido.dataMatricula, 
                MatriculaRecebido.statusMatricula
            );
    
            MatriculaAtualizado.setIdMatricula(parseInt(req.query.idMatricula as string));
    
            const respostaModelo = await Matricula.atualizarCadastroMatricula(MatriculaAtualizado);
    
            if (respostaModelo) {
                return res.status(200).json({mensagem: "Matricula atualizada com sucesso!"});
            } else {
                return res.status(400).json({mensagem: "Não foi possível atualizar o cadastro da matricula. Entre em contato com o administrador do sistema."})
            }
                
        } catch (error) {
            console.log(`Erro ao atualizar um Matricula. ${error}`);
    
            return res.status(400).json({ mensagem: "Não foi possível atualizar a matricula. Entre em contato com o administrador do sistema." });
        }
    }

    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idMatricula = parseInt(req.query.idMatricula as string);
            const resultado = await Matricula.removerMatricula(idMatricula);

            console.log(resultado)

            if (resultado) {
                return res.status(200).json('Matricula removida com sucesso!');
            }else {
                return res.status(400).json('Erro ao remover matricula!');
            }
            
        } catch (error) {
            console.log(`Erro ao remover a matricula ${error}`);
            return res.status(500).send("error");
            
        }
    }
}
