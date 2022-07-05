# Modeling -建造模型

## 元数据模型

DataHub采用模式优先的方法对元数据进行建模。我们使用开源Pegasus模式语言（[PDL](https://linkedin.github.io/rest.li/pdl_schema)）扩展了一组自定义注释来建模元数据。

从概念上讲，元数据时使用以下抽象建模的

- 实体（Entities）

实体是元数据图中的主要节点。例如，Dataset或CorepUser的实例是一个实体。一个实体由一种类型（例如“数据集”）、唯一标识符（例如“urn”）和我们称为方面的元数据属性组（例如文档）组成。

- 方面（Aspects）

  ​	方面是描述实体的特定方面的属性的集合。它们是DataHub中最小的写入原子单元。也就是说，与同一实体关联的多个方面可以独立更新。例如，DatasetProperties包含描述数据集的属性集合。方面可以再实体之间共享，例如“所有权”是一个方面，可以在拥有所有者的实体之间重复使用。共同的方面包括

  - [所有权（ownership）](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/Ownership.pdl)：捕获拥有实体的用户和组。
  - [全局标签（globalTags）](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/GlobalTags.pdl)：捕获对与实体关联的标签的引用。
  - [术语表术语（glossaryTerms）](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/GlossaryTerms.pdl)：捕获对与实体关联的词汇表术语的引用。
  - [集体内存（institutionalMemory）](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/InstitutionalMemory.pdl)：捕获与实体相关的内部公司文档（例如链接！）
  - [状态（status）](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/Status.pdl)：捕获实体的“删除”状态，即是否应该软删除。
  - [子类型（subTypes）](https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/common/SubTypes.pdl)：捕获一个或多个更通用实体类型的“子类型”。一个示例可以是“Looker Explore”数据集、“View”数据集。特定子类型可以暗示给定实体存在某些附加方面。

- 关系（Relationships）

  关系表示2个实体之间的命名边。它们通过方面（Aspects）中的外键属性以及自定义注释`@Relationship`进行声明。关系允许双向遍历边。例如，图表可以通过名为“OwnedBy”的关系讲CorpUser成为其所有者。从Chart或者CorpUser实例开始，这条边将是可以步行的。

- 标识符（Identifiers - Keys & Urns）

  键是一种特殊类型的方面，它包含唯一标识单个实体的字段。关键方面可以序列化为*Urns*，它表示用于主键查找的关键字段的字符串化形式。此外，*Urns*可以转换回关键方面结构，使关键方面成为一种“虚拟”方面。关键方面为客户端提供了一种机制，可以轻松读取包含主键的字段，这些字段通常很有用，例如数据集名称、平台名称等。Urns 提供了一个友好的句柄，可以通过该句柄查询实体，而无需完全物化的结构。

这是一个示例图，由 3 种类型的实体（CorpUser、Chart、Dashboard）、2 种关系类型（OwnedBy、Contains）和 3 种元数据方面（Ownership、ChartInfo 和 DashboardInfo）组成。

![元数据模型示例图](/元数据模型示例图.png)

## 核心

DataHub的“核心”实体类型对构成现代数据堆栈的数据资产进行建模。它们包括

1. **[数据平台](https://datahubproject.io/docs/generated/metamodel/entities/dataplatform)**：一种数据“平台”。也就是说，涉及处理、存储或可视化数据资产的外部系统。示例包括 MySQL、Snowflake、Redshift 和 S3。
2. **[数据集](https://datahubproject.io/docs/generated/metamodel/entities/dataset)**：数据的集合。表、视图、流、文档集合和文件都在 DataHub 上建模为“数据集”。数据集可以附加标签、所有者、链接、词汇表术语和描述。它们还可以具有特定的子类型，例如“视图”、“集合”、“流”、“探索”等。示例包括 Postgres 表、MongoDB 集合或 S3 文件。
3. **[图表](https://datahubproject.io/docs/generated/metamodel/entities/chart)**：从数据集派生的单个数据可视化。一个图表可以是多个仪表板的一部分。图表可以附加标签、所有者、链接、词汇表术语和描述。示例包括 Superset 或 Looker Chart。
4. **[仪表板](https://datahubproject.io/docs/generated/metamodel/entities/dashboard)**：用于可视化的图表集合。仪表板可以附加标签、所有者、链接、词汇表术语和描述。示例包括超集或模式仪表板。
5. **[数据作业](https://datahubproject.io/docs/generated/metamodel/entities/datajob)**（任务）：处理数据资产的可执行作业，其中“处理”意味着使用数据、生成数据或两者兼而有之。数据作业可以附加标签、所有者、链接、词汇表术语和描述。它们必须属于单个数据流。示例包括气流任务。
6. **[数据流](https://datahubproject.io/docs/generated/metamodel/entities/dataflow)**（管道）：具有依赖关系的数据作业的可执行集合，或 DAG。数据作业可以附加标签、所有者、链接、词汇表术语和描述。示例包括 Airflow DAG。

请参阅左侧的**元数据建模/实体部分以探索整个模型。**


