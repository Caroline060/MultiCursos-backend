import { Request, Response, Router} from "express";
import { AlunoController } from "./controller/AlunoController";
import { CursoController } from "./controller/CursoController";
import { MatriculaController } from "./controller/MatriculaController";

// Cria um roteador
const router = Router();

// Rota principal da aplicação
router.get("/", (req: Request, res: Response) => {
    res.json({ mensagem: "Olá, mundo!" });
});

//ROTAS PARA ALUNO
router.get("/lista/aluno", AlunoController.todos);          // Rota para listar os alunos
router.post("/novo/aluno", AlunoController.novo);           // Rota para cadastrar um novo aluno
router.put("/atualiza/aluno/", AlunoController.atualizar);  // Rota para atualizar um aluno
router.put("/remove/aluno/", AlunoController.remover);      // Rota para remover um aluno

//ROTAS PARA CURSO
router.get("/lista/curso", CursoController.todos);          // Rota para listar os cursos
router.post("/novo/curso", CursoController.novo);           // Rota para cadastrar um novo curso
router.put("/atualiza/curso/", CursoController.atualizar);  // Rota para atualizar um curso
router.put("/remove/curso/", CursoController.remover);      // Rota para remover um curso

//ROTAS PARA MATRICULA
router.get("/lista/matricula", MatriculaController.todos);          // Rota para listar as matriculas
router.post("/nova/matricula", MatriculaController.novo);           // Rota para cadastrar uma nova matricula
router.put("/atualiza/matricula/", MatriculaController.atualizar);  // Rota para atualizar uma matricula
router.put("/remove/matricula/", MatriculaController.remover);      // Rota para remover uma matricula

export { router };