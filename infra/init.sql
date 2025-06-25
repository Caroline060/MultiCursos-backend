CREATE TABLE Aluno (
    id_aluno SERIAL PRIMARY KEY,
    nome_aluno VARCHAR (100) NOT NULL,
    cpf VARCHAR (11)  UNIQUE NOT NULL, 
    data_nascimento DATE NOT NULL,
    status_aluno BOOLEAN DEFAULT TRUE
);

CREATE TABLE Curso (
    id_curso SERIAL PRIMARY KEY,
    nome_curso VARCHAR (100) NOT NULL,
    categoria VARCHAR (70) NOT NULL, 
    carga_horaria INT NOT NULL,
    status_curso BOOLEAN DEFAULT TRUE
);

CREATE TABLE Matricula (
    id_matricula SERIAL PRIMARY KEY,
	id_aluno INT NOT NULL,
    id_curso INT NOT NULL,
    data_matricula DATE NOT NULL,
    status_matricula BOOLEAN DEFAULT TRUE
);

CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR (50) NOT NULL,
    senha VARCHAR (20) NOT NULL
)

INSERT INTO Aluno (nome_aluno, cpf, data_nascimento) 
VALUES 
('Maria da Silva', 12345678901, '1995-06-15'),
('João Pereira', 23456789012, '1988-09-22'),
('Ana Souza', 34567890123, '2000-03-10');

INSERT INTO Curso (nome_curso, categoria, carga_horaria) 
VALUES 
('Segurança da Informação', 'Tecnologia', 40),
('Francês', 'Idioma', 30),
('Produtividade e Gestão do Tempo', 'Desenvolvimento Pessoal', 20);

INSERT INTO Matricula (id_aluno, id_curso, data_matricula) 
VALUES 
(1, 1, '2025-05-10'),
(2, 2, '2025-05-11'),
(3, 3, '2025-05-12');

INSERT INTO Usuario (nome_usuario, senha)
VALUES 
('admin', 'senha123'),
('prof.aline', 'aline456'),
('secretaria', 'sec789');

ALTER TABLE Aluno DROP COLUMN status_aluno;
ALTER TABLE Curso DROP COLUMN status_curso;

ALTER TABLE Matricula
ALTER COLUMN status_matricula DROP DEFAULT;

CREATE TYPE status_matricula AS ENUM ('aberta', 'fechada');

ALTER TABLE Matricula
ALTER COLUMN status_matricula TYPE status_matricula
USING 
    CASE 
        WHEN status_matricula = true THEN 'aberta'::status_matricula
        WHEN status_matricula = false THEN 'fechada'::status_matricula
        ELSE 'fechada'::status_matricula -- fallback
    END;

ALTER TABLE Matricula
ALTER COLUMN status_matricula SET DEFAULT 'aberta';