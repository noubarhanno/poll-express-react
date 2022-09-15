import { Request, Response } from "express";
import { Op } from "sequelize";
import db from "../config/db.config";
import { IRequestHeaders, IResponsePayload } from "../interfaces";
import { Polls, IPollAttributes, Choices, Votes } from "../models";

export type TPollBody = {
  title: string;
  options: string[];
  expiration: number; // in days
};

/**
 *
 * @param req  express request - contains the poll data
 * @param res  express response - returns the created poll
 * @returns  express json response with status code 400 or 201
 */
export const createPoll = async (
  req: Request,
  res: Response<IResponsePayload<IPollAttributes>>
) => {
  const { body, headers } = req;
  const { title, expiration, options } = body as TPollBody;
  const { email } = headers as IRequestHeaders;
  if (!title || !expiration || !options) {
    return res.status(400).json({
      success: false,
      error: "Bad Request, missing parameters",
      status: 400,
    });
  }
  try {
    if (options.length >= 2 && options.length <= 5) {
      await Polls.create(
        {
          title,
          expiration: new Date(Date.now() + expiration * 24 * 60 * 60 * 1000),
          createdBy: email,
          choices: options.map((option) => ({ title: option })),
        },
        {
          include: [Choices],
        }
      );
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Poll created successfully",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Bad Request, options length must be between 2 and 5",
      status: 400,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error - " + error,
      status: 500,
    });
  }
};

export const getPolls = async (req: Request, res: Response) => {
  const { headers, query } = req;
  const { limit = 10, page = 0 } = query;
  const { email } = headers as IRequestHeaders;
  const polls = await Polls.findAll({
    where: { createdBy: email },
    order: [["createdAt", "DESC"]],
    limit: limit as number,
    offset: (page as number) * (limit as number),
    include: [
      {
        model: Choices,
        as: "choices",
        attributes: ["title", "id"],
      },
      {
        model: Votes,
        as: "votes",
        attributes: ["createdBy"],
      },
    ],
  });
  return res.status(200).json({
    status: 200,
    success: true,
    data: polls,
  });
};

export const getDashboardPolls = async (req: Request, res: Response) => {
  const { query } = req;
  const { limit = 10, page = 0 } = query;
  const polls = await Polls.findAll({
    order: [["createdAt", "DESC"]],
    limit: limit as number,
    offset: (page as number) * (limit as number),
    include: [
      {
        model: Choices,
        as: "choices",
        attributes: {
          include: [
            [
              db.literal(
                `(SELECT COUNT(*) FROM votes WHERE votes.choiceId = choices.id)`
              ),
              "votesCount",
            ],
          ],
        },
        include: [
          {
            model: Votes,
            attributes: [],
          },
        ],
      },
    ],
  });
  return res.status(200).json({
    status: 200,
    success: true,
    data: polls,
  });
};
