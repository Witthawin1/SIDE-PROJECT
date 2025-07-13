package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"strconv"
)
import "gorm.io/driver/postgres"
import "github.com/gofiber/fiber/v2"
import "github.com/gofiber/fiber/v2/middleware/cors"

type Users struct {
	Id           uint   `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	PasswordHash string `json:"passwordHash"`
}

type Tasks struct {
	Id          uint   `json:"id"`
	UserId      uint   `json:"userId"`
	TaskId      uint   `json:"taskId"`
	Description string `json:"description"`
	DueDate     string `json:"dueDate"`
	Status      string `json:"status"`
}

const (
	host        = "localhost"
	port        = 5432
	user        = "postgres"
	password    = "w123i456n7890"
	dbname      = "mydatabase"
	search_path = "taskManagement"
)

func getUsers(db *gorm.DB) []Users {
	var users []Users
	result := db.Find(&users)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	return users
}

func createUser(db *gorm.DB, users *Users) error {
	hashPassWord, err := bcrypt.GenerateFromPassword([]byte(users.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	users.PasswordHash = string(hashPassWord)
	result := db.Create(&users)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func editUser(db *gorm.DB, users *Users) error {
	result := db.Save(&users)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func deleteUser(db *gorm.DB, id int) error {
	result := db.Delete(&Users{Id: uint(id)})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func getTasks(db *gorm.DB) []Tasks {
	var tasks []Tasks
	result := db.Find(&tasks)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	return tasks
}

func createTask(db *gorm.DB, task *Tasks) error {
	result := db.Create(&task)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func editTask(db *gorm.DB, task *Tasks) error {
	result := db.Save(&task)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	return nil
}

func deleteTask(db *gorm.DB, id int) error {
	result := db.Delete(&Tasks{Id: uint(id)})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func loginUser(db *gorm.DB, user *Users) (string, error) {
	return user.Username, nil
}

func main() {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s search_path=%s",
		host, port, user, password, dbname, search_path)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Database connection successful")

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	app.Get("/users", func(c *fiber.Ctx) error {
		return c.JSON(getUsers(db))
	})

	app.Post("/users", func(c *fiber.Ctx) error {
		user := new(Users)
		if err := c.BodyParser(user); err != nil {
			return err
		}
		err = createUser(db, user)

		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}

		return c.JSON(fiber.Map{
			"message": "user created successfully",
		})
	})

	app.Put("/users/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		user := new(Users)
		if err := c.BodyParser(user); err != nil {
			return err
		}

		user.Id = uint(id)
		err = editUser(db, user)
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"message": "user updated successfully",
		})
	})

	app.Delete("/users/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		user := new(Users)
		if err := c.BodyParser(user); err != nil {
			return err
		}
		err = deleteUser(db, id)
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"message": "user deleted successfully",
		})
	})

	app.Get("/tasks", func(c *fiber.Ctx) error {
		return c.JSON(getTasks(db))
	})

	app.Post("/tasks", func(c *fiber.Ctx) error {
		task := new(Tasks)
		if err := c.BodyParser(task); err != nil {
			return err
		}
		err = createTask(db, task)
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"message": "task created successfully",
		})
	})

	app.Put("/tasks/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		task := new(Tasks)
		if err := c.BodyParser(task); err != nil {
			return err
		}
		task.Id = uint(id)
		err = editTask(db, task)
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"message": "task updated successfully",
		})
	})

	app.Delete("/tasks/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		err = deleteTask(db, id)
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"message": "task deleted successfully",
		})
	})

	app.Listen(":8080")
}
