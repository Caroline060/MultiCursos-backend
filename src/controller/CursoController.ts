import {Request, Response} from "express";
import {Curso} from "../model/Curso";

interface CursoDTO {
    idCurso: number,
    nomeCurso: string,
    categoria: string,
    cargaHoraria: number
}

export class CursoController extends Curso {

    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeCursos = await Curso.listagemCursos();

            return res.status(200).json(listaDeCursos);
            
        } catch (error) {
            console.log('Erro ao acessar listagem de cursos');

            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de cursos" });
        }
    }

    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const CursoRecebido: CursoDTO = req.body;

            const novoCurso = new Curso(CursoRecebido.nomeCurso,                
                                        CursoRecebido.categoria,
                                        CursoRecebido.cargaHoraria);

            console.log(novoCurso);

            const repostaClasse = await Curso.cadastroCurso(novoCurso);

            if(repostaClasse) {
                return res.status(200).json({ mensagem: "Curso cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar o curso. Entre em contato com o administrador do sistema."});
            } 

        } catch (error) {
            console.log(`Erro ao cadastrar um curso. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível cadastrar o curso. Entre em contato com o administrador do sistema." });
        }
    }    

    static async atualizar (req:Request, res:Response): Promise<any> {
        try {
            const CursoRecebido: CursoDTO = req.body;
            const CursoAtualizado = new Curso(
                CursoRecebido.nomeCurso,
                CursoRecebido.categoria,
                CursoRecebido.cargaHoraria
            );

            CursoAtualizado.setIdCurso(parseInt(req.query.idCurso as string));

            const respostaModelo = await Curso.atualizarCadastroCurso(CursoAtualizado);

            if (respostaModelo) {
                return res.status(200).json({mensagem: "Curso atualizado com sucesso!"});
            } else {
                return res.status(400).json({mensagem: "Não foi possível atualizar o cadastro do curso. Entre em contato com o administrador do sistema."})
            }
            
        } catch (error) {
            console.log(`Erro ao atualizar um Curso. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar o curso. Entre em contato com o administrador do sistema." });
        }
    }

    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idCurso = parseInt(req.params.idCurso);
            const result = await Curso.removerCurso(idCurso);
                
            if (result) {
                return res.status(200).json('Curso removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar curso');
            }

        } catch (error) {
            console.log("Erro ao remover o curso");
            console.log(error);
            return res.status(500).send("error");
        }
    }
}

export default CursoController;