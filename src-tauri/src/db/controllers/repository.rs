use async_trait::async_trait;

// Trait describing the common behavior of 
// a repository. TEntity is the type of
// domain entity handled by this repository.
#[async_trait]
pub trait Repository<TEntity> {
    fn query_all(&self) -> Vec<TEntity>;
    fn query_by_id(&self, id: &str) -> Option<TEntity>;
    fn query_by_opts(&self, opts: TEntity) -> Option<TEntity>;
    fn insert(&self, data: TEntity) -> TEntity;
    fn edit(&self, id: &str, data: TEntity) -> Option<TEntity>;
    fn delete(&self, id: &str) -> Option<TEntity>;
}

pub struct SurrealRepository<'a, TData> {
    // reference to SurrealDB's Database object
    db: &'a Surreal<Db>,
    // required as generic type not used
    phantom: PhantomData<TData>,
    // this is needed by SurrealDB API to identify objects
    table_name: &'static str
}