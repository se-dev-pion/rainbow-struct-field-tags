package examples

// [Index Tag] https://gorm.io/docs/indexes.html#Index-Tag
type User struct {
	Name  string `gorm:"index"`
	Name2 string `gorm:"index:idx_name,unique"`
	Name3 string `gorm:"index:,sort:desc,collate:utf8,type:btree,length:10,where:name3 != 'jinzhu'"`
	Name4 string `gorm:"uniqueIndex"`
	Age   int64  `gorm:"index:,class:FULLTEXT,comment:hello world,where:age > 10"`
	Age2  int64  `gorm:"index:,expression:ABS(age)"`
}

// MySQL option
type MySQLUser struct {
	Name string `gorm:"index:,class:FULLTEXT,option:WITH PARSER ngram INVISIBLE"`
}

// PostgreSQL option
type PgUser struct {
	Name string `gorm:"index:,option:CONCURRENTLY"`
}

// [uniqueIndex] https://gorm.io/docs/indexes.html#uniqueIndex
type UniqueUser struct {
	Name1 string `gorm:"uniqueIndex"`
	Name2 string `gorm:"uniqueIndex:idx_name,sort:desc"`
} // [/]
// [/]

// [Composite Indexes] https://gorm.io/docs/indexes.html#Composite-Indexes

// create composite index `idx_member` with columns `name`, `number`
type CompositeUser struct {
	Name   string `gorm:"index:idx_member"`
	Number string `gorm:"index:idx_member"`
}

// [Fields Priority] https://gorm.io/docs/indexes.html#Fields-Priority

// column order: name, number
type User1 struct {
	Name   string `gorm:"index:idx_member"`
	Number string `gorm:"index:idx_member"`
}

// column order: number, name
type User2 struct {
	Name   string `gorm:"index:idx_member,priority:2"`
	Number string `gorm:"index:idx_member,priority:1"`
}

// column order: number, name
type User3 struct {
	Name   string `gorm:"index:idx_member,priority:12"`
	Number string `gorm:"index:idx_member"`
} // [/]

// [Shared composite indexes] https://gorm.io/docs/indexes.html#Shared-composite-indexes
type Foo struct {
	IndexA int `gorm:"index:,unique,composite:myname"`
	IndexB int `gorm:"index:,unique,composite:myname"`
} // [/]

// [/]

// [Multiple indexes] https://gorm.io/docs/indexes.html#Multiple-indexes
type UserIndex struct {
	OID          int64  `gorm:"index:idx_id;index:idx_oid,unique"`
	MemberNumber string `gorm:"index:idx_id;column:num"`
} // [/]
