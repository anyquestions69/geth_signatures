--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6 (Homebrew)
-- Dumped by pg_dump version 14.2

-- Started on 2023-09-13 00:56:51 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "61kaf";
--
-- TOC entry 3606 (class 1262 OID 70390)
-- Name: 61kaf; Type: DATABASE; Schema: -; Owner: pg_database_owner
--

CREATE DATABASE "61kaf" WITH TEMPLATE = template0 ENCODING = 'UTF8';


ALTER DATABASE "61kaf" OWNER TO public_hysteria;

\connect "61kaf"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 71640)
-- Name: files; Type: TABLE; Schema: public; Owner: public_hysteria
--

CREATE TABLE public.files (
    id bigint NOT NULL,
    name text,
    path text,
    status boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.files OWNER TO public_hysteria;

--
-- TOC entry 211 (class 1259 OID 71639)
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: public_hysteria
--

CREATE SEQUENCE public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO public_hysteria;

--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 211
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: public_hysteria
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- TOC entry 214 (class 1259 OID 71649)
-- Name: signatures; Type: TABLE; Schema: public; Owner: public_hysteria
--

CREATE TABLE public.signatures (
    id bigint NOT NULL,
    hash text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "fileId" bigint,
    "userId" bigint
);


ALTER TABLE public.signatures OWNER TO public_hysteria;

--
-- TOC entry 213 (class 1259 OID 71648)
-- Name: signatures_id_seq; Type: SEQUENCE; Schema: public; Owner: public_hysteria
--

CREATE SEQUENCE public.signatures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.signatures_id_seq OWNER TO public_hysteria;

--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 213
-- Name: signatures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: public_hysteria
--

ALTER SEQUENCE public.signatures_id_seq OWNED BY public.signatures.id;


--
-- TOC entry 210 (class 1259 OID 71631)
-- Name: users; Type: TABLE; Schema: public; Owner: public_hysteria
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    wallet character varying(255) NOT NULL,
    name text,
    "isAdmin" boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO public_hysteria;

--
-- TOC entry 209 (class 1259 OID 71630)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: public_hysteria
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO public_hysteria;

--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: public_hysteria
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3444 (class 2604 OID 71643)
-- Name: files id; Type: DEFAULT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- TOC entry 3445 (class 2604 OID 71652)
-- Name: signatures id; Type: DEFAULT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.signatures ALTER COLUMN id SET DEFAULT nextval('public.signatures_id_seq'::regclass);


--
-- TOC entry 3443 (class 2604 OID 71634)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3598 (class 0 OID 71640)
-- Dependencies: 212
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: public_hysteria
--

INSERT INTO public.files (id, name, path, status, "createdAt", "updatedAt") VALUES (1, 'гавш пидор', '/uploads/гавш пидор.pdf', true, '2023-09-13 00:09:33.187+03', '2023-09-13 00:13:22.324+03');


--
-- TOC entry 3600 (class 0 OID 71649)
-- Dependencies: 214
-- Data for Name: signatures; Type: TABLE DATA; Schema: public; Owner: public_hysteria
--

INSERT INTO public.signatures (id, hash, "createdAt", "updatedAt", "fileId", "userId") VALUES (1, '0x0f3da69e4ccf6ee49009338ecc166a8f46af74bdc7f50f7ab0b3941d932428b337db742936eb1248979ba3d9949312604028f4a8c2812911bc2f549991dee05d1b', '2023-09-13 00:12:24.193+03', '2023-09-13 00:12:24.193+03', 1, 15);
INSERT INTO public.signatures (id, hash, "createdAt", "updatedAt", "fileId", "userId") VALUES (2, '0xe6dfe4210dec3c634eeabe131493917a56ea98259cdb942803fafbee5e70e2625f3d4b1ba28f49b71f322e1b520db0ec480582f8fcb36849f4e19a4e0ac830351c', '2023-09-13 00:13:22.283+03', '2023-09-13 00:13:22.283+03', 1, 14);


--
-- TOC entry 3596 (class 0 OID 71631)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: public_hysteria
--

INSERT INTO public.users (id, wallet, name, "isAdmin", "createdAt", "updatedAt") VALUES (14, '0xB5fF838C935Ad78c92c4d221f18EDDd5AA461bfB', 'Администратор', true, '2023-09-13 00:07:20.246+03', '2023-09-13 00:07:20.246+03');
INSERT INTO public.users (id, wallet, name, "isAdmin", "createdAt", "updatedAt") VALUES (15, '0x69ea6A914a65d38D45719BFf0D0BfbF524797015', 'Горшков Роман Дмитриевич', NULL, '2023-09-13 00:12:09.405+03', '2023-09-13 00:12:09.405+03');


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 211
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: public_hysteria
--

SELECT pg_catalog.setval('public.files_id_seq', 1, true);


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 213
-- Name: signatures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: public_hysteria
--

SELECT pg_catalog.setval('public.signatures_id_seq', 2, true);


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: public_hysteria
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- TOC entry 3449 (class 2606 OID 71647)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 3451 (class 2606 OID 71658)
-- Name: signatures signatures_fileId_userId_key; Type: CONSTRAINT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT "signatures_fileId_userId_key" UNIQUE ("fileId", "userId");


--
-- TOC entry 3453 (class 2606 OID 71656)
-- Name: signatures signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_pkey PRIMARY KEY (id);


--
-- TOC entry 3447 (class 2606 OID 71638)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3454 (class 2606 OID 71659)
-- Name: signatures signatures_fileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT "signatures_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES public.files(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3455 (class 2606 OID 71664)
-- Name: signatures signatures_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: public_hysteria
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT "signatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2023-09-13 00:56:52 MSK

--
-- PostgreSQL database dump complete
--

