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

![未找到图片：/img/datahub/元数据模型示例图.png](/img/datahub/元数据模型示例图.png "未找到图片：/img/datahub/元数据模型示例图.png")

## 核心

DataHub的“核心”实体类型对构成现代数据堆栈的数据资产进行建模。它们包括

1. **[数据平台](https://datahubproject.io/docs/generated/metamodel/entities/dataplatform)**：一种数据“平台”。也就是说，涉及处理、存储或可视化数据资产的外部系统。示例包括 MySQL、Snowflake、Redshift 和 S3。
2. **[数据集](https://datahubproject.io/docs/generated/metamodel/entities/dataset)**：数据的集合。表、视图、流、文档集合和文件都在 DataHub 上建模为“数据集”。数据集可以附加标签、所有者、链接、词汇表术语和描述。它们还可以具有特定的子类型，例如“视图”、“集合”、“流”、“探索”等。示例包括 Postgres 表、MongoDB 集合或 S3 文件。
3. **[图表](https://datahubproject.io/docs/generated/metamodel/entities/chart)**：从数据集派生的单个数据可视化。一个图表可以是多个仪表板的一部分。图表可以附加标签、所有者、链接、词汇表术语和描述。示例包括 Superset 或 Looker Chart。
4. **[仪表板](https://datahubproject.io/docs/generated/metamodel/entities/dashboard)**：用于可视化的图表集合。仪表板可以附加标签、所有者、链接、词汇表术语和描述。示例包括超集或模式仪表板。
5. **[数据作业](https://datahubproject.io/docs/generated/metamodel/entities/datajob)**（任务）：处理数据资产的可执行作业，其中“处理”意味着使用数据、生成数据或两者兼而有之。数据作业可以附加标签、所有者、链接、词汇表术语和描述。它们必须属于单个数据流。示例包括气流任务。
6. **[数据流](https://datahubproject.io/docs/generated/metamodel/entities/dataflow)**（管道）：具有依赖关系的数据作业的可执行集合，或 DAG。数据作业可以附加标签、所有者、链接、词汇表术语和描述。示例包括 Airflow DAG。

请参阅左侧的**元数据建模/实体部分以探索整个模型。**

## 实体
DataHub中定义的尸体及其方面在哪里？元数据模型“活在哪里”？元数据模型通过**实体注册表**缝合在一起，实体目录包含元数据图以及与每个相关方面。简而言之，这是定义模型的“模式”的地方。

传统上，实体注册表是使用快照模型构建的，这些模型是明确将实体与与其关联的方面相关联的模式。一个例子是DatasetSnapshot，它定义了核心`Dataset`实体。数据集实体的方面是通过特殊“方面”模式内的联合字段捕获的。一个例子是DatasetAspect。此文件将特定于数据集的方面（如DatasetProperties）和公共方面（如Ownership、InstitutionalMemory和Status）于数据集实体相关联。这种定义实体的方法很快就会被弃用，取而代之的是一种新方法。

截至2022年1月，DataHub已经弃用对快照模型的支持，以作为添加新实体的一种方式。相反，实体注册表是在名为entity-registry.yml的YAML配置文件中定义的，该文件在启动时提供给DataHub的元数据服务。该文件通过引用它们的名称来声明实体和方面。在启动时，DataHub验证注册表文件的结构并确保它可以找到与配置提供的每个方面名称相关联的PDL模式(通过@Aspect注释)。

通过迁移到这种格式，元数据模型的发展变得更加容易。添加实体和方面成为向YAML配置添加问题，而不是创建新的快找/方面文件。

## 探索DataHub的元数据

要探索当前的DataHub元数据模型，您可以检查此高级图片，该图片显示了他们之间的不同实体边缘，显示了它们之间的关系。

![](/img/datahub/datahub-metadata-model-5bb29805d050eaf5751cdd744386150e.png)
要导航特定实体的方面模型并使用该概念探索关系，您可以在我们的演示环境中查看它们或在左侧的**元数据建模/实体**`foreign-key`部分中导航自动生成文档。
例如，以下是指向DataHub元数据模型中最流行实体的有用链接

- [数据集](https://datahubproject.io/docs/generated/metamodel/entities/dataset)：[配置](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,Dataset,PROD%29/Schema?is_lineage_mode=false) [文件文档](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,Dataset,PROD%29/Documentation?is_lineage_mode=false)
- [仪表板](https://datahubproject.io/docs/generated/metamodel/entities/dashboard)：[配置](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,Dashboard,PROD%29/Schema?is_lineage_mode=false) [文件文档](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,Dashboard,PROD%29/Documentation?is_lineage_mode=false)
- [用户（又名 CorpUser）](https://datahubproject.io/docs/generated/metamodel/entities/corpuser)：[个人资料](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,Corpuser,PROD%29/Schema?is_lineage_mode=false) [文档](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,Corpuser,PROD%29/Documentation?is_lineage_mode=false)
- [管道（又名 DataFlow）](https://datahubproject.io/docs/generated/metamodel/entities/dataflow)：[配置](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,DataFlow,PROD%29/Schema?is_lineage_mode=false) [文件文档](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,DataFlow,PROD%29/Documentation?is_lineage_mode=false)
- [特征表（又名 MLFeatureTable）](https://datahubproject.io/docs/generated/metamodel/entities/mlfeaturetable)：[配置](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,MlFeatureTable,PROD%29/Schema?is_lineage_mode=false) [文件文档](https://demo.datahubproject.io/dataset/urn:li:dataset:%28urn:li:dataPlatform:datahub,MlFeatureTable,PROD%29/Documentation?is_lineage_mode=false)
- 有关元数据模型中实体的完整列表，请[在此处](https://demo.datahubproject.io/browse/dataset/prod/datahub/entities)浏览它们或使用左侧的**元数据建模/实体部分。**

### 为元数据

- 本网站：本网站的元数据模型文档是使用生成的`./gradlew:docs-website:yarnBuild`，它将模型文档的生成委托给模块中的`modelDocGen`任务`metadata-ingestion`。

## 查询元数据

DataHub的建模语言运行您优化元数据持久性以查询模式保持一致。
支持三种查询元数据图的方式：通过主键查找、搜索查询和通过关系遍历。

> 对PDL文件不熟悉？别担心。他们知识为DataHub中的Aspects定义JSON文档“模式”的一种方式。摄取到DataHub元数据服务的所有数据都针对PDL模式进行验证，每个@Aspect对应于一个模式。在结构上，PDL于Protobuf非常相似，并且可以方便的映射到JSON。

### 查询

#### 获取最新的实体方面（快照

通过主键查询实体意味着使用“实体”端点，传入要检索的实体的骨灰盒。

例如，要获取Chart实体，我们可以使用以下内容`curl`:
```powershell
curl --location --request GET 'http://localhost:8080/entities/urn%3Ali%3Achart%3Acustomers
```

此请求将返回一组版本化方面，每个方面都是最新版本。
您会注意到，我们使用与实体关联的url执行超找。响应将是包含实体快照的“实体”记录（它又包含与实体关联的最新方面）。

#### 获取版本化

DataHub还支持获取有关实体的各个元数据，我们称之为方面。为此，您将提供实体的主键（urn）以及要检索的方面名称和版本。
例如，要获取数据集的SchemaMetadata方面的最新版本，您将发出以下查询：

```powershell
curl 'http://localhost:8080/aspects/urn%3Ali%3Adataset%3A(urn%3Ali%3AdataPlatform%3Afoo%2Cbar%2CPROD)?aspect=schemaMetadata&version=0'

{
   "version":0,
   "aspect":{
      "com.linkedin.schema.SchemaMetadata":{
         "created":{
            "actor":"urn:li:corpuser:fbar",
            "time":0
         },
         "platformSchema":{
            "com.linkedin.schema.KafkaSchema":{
               "documentSchema":"{\"type\":\"record\",\"name\":\"MetadataChangeEvent\",\"namespace\":\"com.linkedin.mxe\",\"doc\":\"Kafka event for proposing a metadata change for an entity.\",\"fields\":[{\"name\":\"auditHeader\",\"type\":{\"type\":\"record\",\"name\":\"KafkaAuditHeader\",\"namespace\":\"com.linkedin.avro2pegasus.events\",\"doc\":\"Header\"}}]}"
            }
         },
         "lastModified":{
            "actor":"urn:li:corpuser:fbar",
            "time":0
         },
         "schemaName":"FooEvent",
         "fields":[
            {
               "fieldPath":"foo",
               "description":"Bar",
               "type":{
                  "type":{
                     "com.linkedin.schema.StringType":{
                        
                     }
                  }
               },
               "nativeDataType":"string"
            }
         ],
         "version":0,
         "hash":"",
         "platform":"urn:li:dataPlatform:foo"
      }
   }
}
```

#### 获取时间序列

DataHub支持用于获取一组有关实体的时间序列方面的API。例如，您可能希望使用此API来获取最近的分析运行和有关数据集的统计信息。为此，您可以针对`/aspects`端点发出“获取请求”。
例如，要获取数据集的数据集配置文件（即统计信息），您将发出以下查询：
```powershell
curl -X POST 'http://localhost:8080/aspects?action=getTimeseriesAspectValues' \
--data '{
    "urn": "urn:li:dataset:(urn:li:dataPlatform:redshift,global_dev.larxynx_carcinoma_data_2020,PROD)",
    "entity": "dataset",
    "aspect": "datasetProfile",
    "startTimeMillis": 1625122800000,
    "endTimeMillis": 1627455600000
}'

{
   "value":{
      "limit":10000,
      "aspectName":"datasetProfile",
      "endTimeMillis":1627455600000,
      "startTimeMillis":1625122800000,
      "entityName":"dataset",
      "values":[
         {
            "aspect":{
               "value":"{\"timestampMillis\":1626912000000,\"fieldProfiles\":[{\"uniqueProportion\":1.0,\"sampleValues\":[\"123MMKK12\",\"13KDFMKML\",\"123NNJJJL\"],\"fieldPath\":\"id\",\"nullCount\":0,\"nullProportion\":0.0,\"uniqueCount\":3742},{\"uniqueProportion\":1.0,\"min\":\"1524406400000\",\"max\":\"1624406400000\",\"sampleValues\":[\"1640023230002\",\"1640343012207\",\"16303412330117\"],\"mean\":\"1555406400000\",\"fieldPath\":\"date\",\"nullCount\":0,\"nullProportion\":0.0,\"uniqueCount\":3742},{\"uniqueProportion\":0.037,\"min\":\"21\",\"median\":\"68\",\"max\":\"92\",\"sampleValues\":[\"45\",\"65\",\"81\"],\"mean\":\"65\",\"distinctValueFrequencies\":[{\"value\":\"12\",\"frequency\":103},{\"value\":\"54\",\"frequency\":12}],\"fieldPath\":\"patient_age\",\"nullCount\":0,\"nullProportion\":0.0,\"uniqueCount\":79},{\"uniqueProportion\":0.00820873786407767,\"sampleValues\":[\"male\",\"female\"],\"fieldPath\":\"patient_gender\",\"nullCount\":120,\"nullProportion\":0.03,\"uniqueCount\":2}],\"rowCount\":3742,\"columnCount\":4}",
               "contentType":"application/json"
            }
         },
      ]
   }
}
```