CREATE DATABASE "61kaf"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE SCHEMA IF NOT EXISTS public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    wallet character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default",
    "isAdmin" boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.files
(
    id bigint NOT NULL DEFAULT nextval('files_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    path text COLLATE pg_catalog."default",
    status boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT files_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.files
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.signatures
(
    id bigint NOT NULL DEFAULT nextval('signatures_id_seq'::regclass),
    hash text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "fileId" bigint,
    "userId" bigint,
    CONSTRAINT signatures_pkey PRIMARY KEY (id),
    CONSTRAINT "signatures_fileId_userId_key" UNIQUE ("fileId", "userId"),
    CONSTRAINT "signatures_fileId_fkey" FOREIGN KEY ("fileId")
        REFERENCES public.files (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "signatures_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.signatures
    OWNER to postgres;