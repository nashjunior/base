export interface OutputBuscarPessoaCivil {
  civil_codigo: string
  uni_codigo: number
  cvt_codigo: number
}

export interface IPessoasCivisRepository {
  buscarPeloPesCodigo(
    pes_codigo: string,
  ): Promise<OutputBuscarPessoaCivil | null>
}
