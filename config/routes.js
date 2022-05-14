const express = require("express");
const controllers = require("../app/controllers");
const middlewares = require("../app/middlewares");


const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../data/swagger.json");

const appRouter = express.Router();
const apiRouter = express.Router();


/**
 * TODO: Implement your own API
 *       implementations
 */

//add user (no admin or superAdmin)
apiRouter.post("/api/v1/register",
  controllers.api.v1.users.checkCondition,
  controllers.api.v1.users.register
);

//get all data user by superAdmin
apiRouter.get("/api/v1/users/:id",
  middlewares.auth.authorize,
  controllers.api.v1.users.getUser
);

//update user by superAdmin
apiRouter.put("/api/v1/users/:id",
  middlewares.auth.checkSameIdOrAdmin,
  controllers.api.v1.users.update
);

//delete user by superAdmin
apiRouter.delete("/api/v1/users/:id",
  middlewares.auth.checkSameIdOrAdmin,
  controllers.api.v1.users.delete
);

//get all user who has registered
apiRouter.get("/api/v1/users",
  middlewares.auth.authorize,
  controllers.api.v1.users.getAll
);

//login user
apiRouter.post("/api/v1/login",
  controllers.api.v1.users.checkData,
  controllers.api.v1.users.login
);

//check role
apiRouter.get("/api/v1/dashboard",
  middlewares.auth.authorize,
  controllers.api.v1.users.whoAmI
);

//update role by superAdmin
apiRouter.put("/api/v1/users/:id/update-admin",
  middlewares.auth.checkSuperAdmin,
  controllers.api.v1.users.intoAdmin
);



//routing API server with auth only can access for admin and superAdmin
//create data by admin and superAdmin
apiRouter.post("/api/v1/create",
  middlewares.auth.checkAdmin,
  controllers.api.v1.cars.create
);

//get all data by admin and superAdmin
apiRouter.get("/api/v1/accessadmin/cars",
  middlewares.auth.checkAdmin,
  controllers.api.v1.cars.getAll
);

//get data by admin and superAdmin
apiRouter.get("/api/v1/cars/:id",
  middlewares.auth.authorize,
  controllers.api.v1.cars.getCar
);

//update data by admin and superAdmin
apiRouter.put("/api/v1/cars/:id",
  middlewares.auth.checkAdmin,
  controllers.api.v1.cars.update
);

//delete data by admin and superAdmin
apiRouter.delete("/api/v1/cars/:id",
  middlewares.auth.checkAdmin,
  controllers.api.v1.cars.delete
);

// open api document
apiRouter.use("/api-docs", swaggerUi.serve);
apiRouter.get("/api-docs", swaggerUi.setup(swaggerDocument));



/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
appRouter.get("/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

appRouter.use(apiRouter);

/** Mount Not Found Handler */
appRouter.use(controllers.main.onLost);

/** Mount Exception Handler */
appRouter.use(controllers.main.onError);

module.exports = appRouter;
