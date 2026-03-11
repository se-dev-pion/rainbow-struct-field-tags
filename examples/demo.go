package examples

type Person struct {
	Name   string `json:"name" binding:"required"`
	Gender string `json:"gender" binding:"required,oneof=male female"`
	Age    int    `json:"age" binding:"required,max=100,min=1"`
}

type Form struct {
	ID   int64  `gorm:"column:id;type:bigint;primary_key;auto_increment;not null"`
	Name string `gorm:"column:name;type:varchar(255);not null;default:'<NAME>';unique"`
}
