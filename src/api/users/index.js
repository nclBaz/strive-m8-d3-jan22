import express from "express"
import createError from "http-errors"
import { adminOnlyMiddleware } from "../../auth/admin.js"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { generateAccessToken } from "../../auth/tools.js"
import UsersModel from "./model.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new UsersModel(req.body)
    const { _id } = await user.save()
    res.status(201).send({ _id }) // { _id: "oijaosidjosajodjsaoi"}
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    const modifiedUser = await UsersModel.findByIdAndUpdate(req.user._id, req.body)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  await UsersModel.findByIdAndDelete(req.user._id)
})

usersRouter.get("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const user = await UsersModel.checkCredentials(email, password)

    if (user) {
      // 3. If credentials are ok --> generate an access token (JWT) and send it as a response

      const accessToken = await generateAccessToken({ _id: user._id, role: user.role })
      res.send({ accessToken })
    } else {
      // 4. If credentials are not ok --> throw an error (401)
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
