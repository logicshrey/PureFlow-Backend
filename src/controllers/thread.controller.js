import { React } from "../models/technologies/react.model.js";
import { Express } from "../models/technologies/express.model.js";
import { Mongodb } from "../models/technologies/mongodb.model.js";
import { Node } from "../models/technologies/node.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { common_id } from "../constants.js";
import { apiResponse } from "../utils/apiResponse.js"
import { Order } from "../models/technologies/orders.model.js";

const postThreadReact = asyncHandler(async(req,res)=>{

    const { topic, tagline, brew_article } = req.body

    if( [topic,tagline,brew_article].some((ele)=>{
        !ele || ele.trim === "" 
    })) {
        throw new apiError(400,"All fields are required!")
    }

    const imageLocalPath = req.file?.path
    // console.log(req.file);
    let image

    if(imageLocalPath){
        image = await uploadOnCloudinary(imageLocalPath)
        
        if(!image?.url){
            throw new apiError(500,"Error while uploading image on cloudinary...")
        }
    }

    const user_id = req.user?._id
   
   const thread = await React.create({
    topic,
    tagline,
    brew_article,
    image: image?.url || null,
    common_id: common_id,
    user_id: user_id
   })

   if(!thread){
    throw new apiError(500,"Something went wrong while creating thread!")
   }
    
   return res
   .status(200)
   .json(new apiResponse(200,"Thread [Brew] Successfully Created", thread))


})

const postThreadExpress = asyncHandler(async(req,res)=>{

    const { title, quantity, type, water_type, address, name, email, mobile } = req.body

    if( [title, quantity, type, water_type, address, name, email, mobile].some((ele)=>{
        !ele || ele.trim === "" 
    })) {
        throw new apiError(400,"All fields are required!")
    }

    const imageLocalPath = req.file?.path

    let image

    if(imageLocalPath){
        image = await uploadOnCloudinary(imageLocalPath)
        
        if(!image?.url){
            throw new apiError(500,"Error while uploading image on cloudinary...")
        }
    }

    const user_id = req.user?._id
   
   const thread = await Order.create({
    title,
    quantity,
    type,
    water_type,
    name,
    address,
    email,
    mobile,
    image: image?.url || null,
    common_id: common_id,
    user_id: user_id
   })

   if(!thread){
    throw new apiError(500,"Something went wrong while creating thread!")
   }
    
   return res
   .status(200)
   .json(new apiResponse(200,"Thread [Brew] Successfully Created", thread))


})

const postThreadNode = asyncHandler(async(req,res)=>{

    const { topic, tagline, brew_article } = req.body

    if( [topic,tagline,brew_article].some((ele)=>{
        !ele || ele.trim === "" 
    })) {
        throw new apiError(400,"All fields are required!")
    }

    const imageLocalPath = req.file?.path

    let image

    if(imageLocalPath){
        image = await uploadOnCloudinary(imageLocalPath)
        
        if(!image?.url){
            throw new apiError(500,"Error while uploading image on cloudinary...")
        }
    }

    const user_id = req.user?._id

   const thread = await Node.create({
    topic,
    tagline,
    brew_article,
    image: image?.url || null,
    common_id: common_id,
    user_id: user_id
   })

   if(!thread){
    throw new apiError(500,"Something went wrong while creating thread!")
   }
    
   return res
   .status(200)
   .json(new apiResponse(200,"Thread [Brew] Successfully Created", thread))


})

const postThreadMongodb = asyncHandler(async(req,res)=>{

    const { topic, tagline, brew_article } = req.body

    if( [topic,tagline,brew_article].some((ele)=>{
        !ele || ele.trim === "" 
    })) {
        throw new apiError(400,"All fields are required!")
    }

    const imageLocalPath = req.file?.path

    let image

    if(imageLocalPath){
        image = await uploadOnCloudinary(imageLocalPath)
        
        if(!image?.url){
            throw new apiError(500,"Error while uploading image on cloudinary...")
        }
    }

    const user_id = req.user?._id
   
   const thread = await Mongodb.create({
    topic,
    tagline,
    brew_article,
    image: image?.url || null,
    common_id: common_id,
    user_id: user_id
   })

   if(!thread){
    throw new apiError(500,"Something went wrong while creating thread!")
   }
    
   return res
   .status(200)
   .json(new apiResponse(200,"Thread [Brew] Successfully Created", thread))


})

const randomThreadReact = asyncHandler(async(req,res)=>{
    
  const threads = await Order.aggregate([
    {
        $match: {common_id: common_id}
    },
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          //   pipeline: [
          //       {
          //           $addFields: {
          //               userinfo: "$user"
          //           }
          //       }
          //   ]
        }
    },
    {
      $addFields: {
          username: "$user.username",
          avatar: "$user.avatar"
      }  
  },
    {
        $project: {
            title: 1,
            quantity: 1,
            image: 1,
            address: 1,
            mobile: 1,
            email: 1,
            type: 1,
            water_type: 1,
            name: 1,
            username: 1,
            avatar: 1,
            createdAt: 1
        }
    }
  ])

      if(!threads){
        throw new apiError(500,"Something went wrong while fetching threads from database...")
      }

      return res
      .status(200)
      .json(new apiResponse(200,"All Threads fetched successfully!",threads))

})


const userProducts = asyncHandler(async(req,res)=>{
    
  const threads = await React.aggregate([
    {
        $match: {common_id: common_id}
    },
    {
        $lookup: {
            from: "admin",
            localField: "admin_id",
            foreignField: "_id",
            as: "admin",
          //   pipeline: [
          //       {
          //           $addFields: {
          //               userinfo: "$user"
          //           }
          //       }
          //   ]
        }
    },
    {
      $addFields: {
          username: "$admin.username",
          avatar: "$admin.avatar"
      }  
  },
    {
        $project: {
            topic: 1,
            tagline: 1,
            image: 1,
            brew_article: 1,
            username: 1,
            avatar: 1,
            createdAt: 1
        }
    }
  ])

  if(!threads){
    throw new apiError(500,"Something went wrong while fetching threads from database...")
  }

  return res
  .status(200)
  .json(new apiResponse(200,"All Threads fetched successfully!",threads))

})

const randomThreadExpress = asyncHandler(async(req,res)=>{
    
    const threads = await Express.aggregate([
      {
          $match: {common_id: common_id}
      },
      {
          $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$user.username",
            avatar: "$user.avatar"
        }  
    },
      {
          $project: {
              topic: 1,
              tagline: 1,
              image: 1,
              brew_article: 1,
              username: 1,
              avatar: 1,
              createdAt: 1
          }
      }
    ])

    if(!threads){
      throw new apiError(500,"Something went wrong while fetching threads from database...")
    }

    return res
    .status(200)
    .json(new apiResponse(200,"All Threads fetched successfully!",threads))

})

const randomThreadAdmin = asyncHandler(async(req,res)=>{
    
    const threads = await Express.aggregate([
      {
          $match: {common_id: common_id}
      },
      {
          $lookup: {
              from: "admin",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$admin.username",
            avatar: "$admin.avatar"
        }  
    },
      {
          $project: {
              topic: 1,
              tagline: 1,
              image: 1,
              brew_article: 1,
              username: 1,
              avatar: 1,
              createdAt: 1
          }
      }
    ])

    if(!threads){
      throw new apiError(500,"Something went wrong while fetching threads from database...")
    }

    return res
    .status(200)
    .json(new apiResponse(200,"All Threads fetched successfully!",threads))

})

const randomThreadNode = asyncHandler(async(req,res)=>{
    
    const threads = await Node.aggregate([
      {
          $match: {common_id: common_id}
      },
      {
          $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$user.username",
            avatar: "$user.avatar"
        }  
    },
      {
          $project: {
              topic: 1,
              tagline: 1,
              image: 1,
              brew_article: 1,
              username: 1,
              avatar: 1,
              createdAt: 1
          }
      }
    ])

    if(!threads){
      throw new apiError(500,"Something went wrong while fetching threads from database...")
    }

    return res
    .status(200)
    .json(new apiResponse(200,"All Threads fetched successfully!",threads))

})

const randomThreadMongodb = asyncHandler(async(req,res)=>{
    
    const threads = await Mongodb.aggregate([
      {
          $match: {common_id: common_id}
      },
      {
          $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$user.username",
            avatar: "$user.avatar"
        }  
    },
      {
          $project: {
              topic: 1,
              tagline: 1,
              image: 1,
              brew_article: 1,
              username: 1,
              avatar: 1,
              createdAt: 1
          }
      }
    ])

    if(!threads){
      throw new apiError(500,"Something went wrong while fetching threads from database...")
    }

    return res
    .status(200)
    .json(new apiResponse(200,"All Threads fetched successfully!",threads))

})

const searchThreadReact = asyncHandler(async(req,res)=>{

  const title = req.body.topic
  if(!title){
    throw new apiError(400,"Topic is required for searching threads!")
  }

  const threads = await Order.aggregate([
    {
      $match: {title: title}
    },
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          //   pipeline: [
          //       {
          //           $addFields: {
          //               userinfo: "$user"
          //           }
          //       }
          //   ]
        }
    },
    {
      $addFields: {
          username: "$user.username",
          avatar: "$user.avatar"
      }  
  },
    {
        $project: {
            title: 1,
            quantity: 1,
            image: 1,
            address: 1,
            mobile: 1,
            email: 1,
            type: 1,
            water_type: 1,
            name: 1,
            username: 1,
            avatar: 1,
            createdAt: 1
        }
    }
  ])

  if(!threads){
    throw new apiError(500,"Something went wrong while fetching searched threads from database...")
  }
  
  return res
    .status(200)
    .json(new apiResponse(200,"Searched Threads fetched successfully!",threads))

})

const searchThreadExpress = asyncHandler(async(req,res)=>{

    const topic = req.body.topic
    // console.log(topic);
    if(!topic){
      throw new apiError(400,"Topic is required for searching threads!")
    }
  
    const threads = await React.aggregate([
      {
          $match: {topic: topic}
      },
      {
          $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$user.username",
            avatar: "$user.avatar"
        }  
    },
      {
          $project: {
             topic: 1,
             tagline: 1,
             image: 1,
             brew_article: 1,
             username: 1,
             avatar: 1,
             createdAt: 1 
          }
      }
    ])
  
    if(!threads){
      throw new apiError(500,"Something went wrong while fetching searched threads from database...")
    }
    
    return res
      .status(200)
      .json(new apiResponse(200,"Searched Threads fetched successfully!",threads))
  
  })

  const searchThreadNode = asyncHandler(async(req,res)=>{

    const topic = req.body.topic
  
    if(!topic){
      throw new apiError(400,"Topic is required for searching threads!")
    }
  
    const threads = await Node.aggregate([
      {
          $match: {topic: topic}
      },
      {
          $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$user.username",
            avatar: "$user.avatar"
        }  
    },
      {
          $project: {
             topic: 1,
             tagline: 1,
             image: 1,
             brew_article: 1,
             username: 1,
             avatar: 1,
             createdAt: 1 
          }
      }
    ])
  
    if(!threads){
      throw new apiError(500,"Something went wrong while fetching searched threads from database...")
    }
    
    return res
      .status(200)
      .json(new apiResponse(200,"Searched Threads fetched successfully!",threads))
  
  })

  const searchThreadMongodb = asyncHandler(async(req,res)=>{

    const topic = req.body.topic
  
    if(!topic){
      throw new apiError(400,"Topic is required for searching threads!")
    }
  
    const threads = await Mongodb.aggregate([
      {
          $match: {topic: topic}
      },
      {
          $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            //   pipeline: [
            //       {
            //           $addFields: {
            //               userinfo: "$user"
            //           }
            //       }
            //   ]
          }
      },
      {
        $addFields: {
            username: "$user.username",
            avatar: "$user.avatar"
        }  
    },
      {
          $project: {
             topic: 1,
             tagline: 1,
             image: 1,
             brew_article: 1,
             username: 1,
             avatar: 1,
             createdAt: 1 
          }
      }
    ])
  
    if(!threads){
      throw new apiError(500,"Something went wrong while fetching searched threads from database...")
    }
    
    return res
      .status(200)
      .json(new apiResponse(200,"Searched Threads fetched successfully!",threads))
  
  })


  const deleteOrder = asyncHandler(async(req,res)=>{

    const id = req.body.id
  
    if(!id){
      throw new apiError(400,"Id is required for deleting threads!")
    }
  
    await Order.deleteOne( { _id: id } )
  
   
    
    return res
      .status(200)
      .json(new apiResponse(200,"Deleted successfully!"))
  
  })


  export { deleteOrder, userProducts,postThreadReact, postThreadExpress, postThreadMongodb, postThreadNode, randomThreadReact, randomThreadExpress, randomThreadNode, randomThreadMongodb, searchThreadReact, searchThreadExpress, searchThreadNode, searchThreadMongodb, randomThreadAdmin }