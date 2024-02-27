import { AppDataSource } from '../.'

AppDataSource.initialize()
  .then(async (datasource) => {
    console.log('Data Source has been initialized!')

    // await new TiposAfastamentosSeeder().run(datasource)
    // await new TiposFuncoesComissaoSeeder().run(datasource)

    console.log('Seeds have been executed successfully')
    AppDataSource.close()
  })
  .catch((error) => console.log(error))
