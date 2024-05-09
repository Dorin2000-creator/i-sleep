import userModel from "../models/userModel.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "All Users List",
      users
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error getting users"
    });
  }
};

// export const getSingleUserController = async (req, res) => {
//     try {
//       // Căutăm utilizatorul folosind _id
//       const user = await userModel.findById(req.params.id);
//       if (!user) {
//         return res.status(404).send({
//           success: false,
//           message: "User not found",
//         });
//       }
  
//       res.status(200).send({
//         success: true,
//         message: "Single User Fetched",
//         user,
//       });
//     } catch (error) {
//       console.log(error);
//       // În cazul unei erori de validare a ID-ului (de exemplu, format incorect), putem returna un status 400
//       if (error.kind === 'ObjectId') {
//         return res.status(400).send({
//           success: false,
//           message: "Invalid user ID format",
//           error,
//         });
//       }
//       res.status(500).send({
//         success: false,
//         message: "Error while getting single user",
//         error,
//       });
//     }
//   };