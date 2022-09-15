import { Request, Response } from "express";
import { Op } from "sequelize";
import { IRequestHeaders, IResponsePayload } from "../interfaces";
import { Choices, IVotesAttributes, Polls, Votes } from "../models";
import Poll from "../models/polls";

type TVoteBody = {
  pollId: number;
  choiceId: number;
};

const canUserVote = async (choiceId: number, email: string) => {
  const choiceOption = await Choices.findOne({
    where: {
      id: choiceId,
    },
  });
  const pollRecord = await Polls.findOne({
    where: {
      id: choiceOption?.pollId,
      createdBy: {
        [Op.ne]: email,
      },
    },
  });
  const expiration = pollRecord?.expiration?.getTime();
  if (!!choiceOption && expiration && expiration > Date.now()) {
    const voteRecord = await Votes.findOne({
      where: {
        choiceId,
        createdBy: email,
      },
    });
    if (!voteRecord) {
      return true;
    }
  }
  return false;
};

/**
 *
 * @param req express request - contains the vote data
 * @param res express response - returns the created vote and increment the poll voting count
 * @returns  express json response with status code 400 or 200
 */
export const createVote = async (
  req: Request,
  res: Response<IResponsePayload<IVotesAttributes>>
) => {
  const { body, headers } = req;
  const { choiceId } = body as TVoteBody;
  const { email } = headers as IRequestHeaders;
  if (!choiceId) {
    return res.status(400).json({
      success: false,
      error: "Bad Request, missing parameters choice id",
      status: 400,
    });
  }
  try {
    const canVote = await canUserVote(choiceId, email);
    if (canVote) {
      await Votes.create(
        {
          createdBy: email,
          choiceId,
        },
        {
          include: [Choices],
        }
      );
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Vote created successfully",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Bad Request, you can't vote invalid voting data",
      status: 400,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error - " + err,
      status: 500,
    });
  }
};
