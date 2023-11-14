import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { RecommendedVideos } from "../../Types";
import { parseRecommendedData } from "../../utils";
import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const getRecommendedVideos = createAsyncThunk(
  "yotubeApp/getRecommendedVideos",
  async (videoId: string, { getState }) => {
    const state = getState() as RootState;
    const currentPlaying = state.youtubeApp.currentPlaying;

    // Type guard to check if currentPlaying is not null
    if (currentPlaying && "channelInfo" in currentPlaying) {
      const {
        data: { items },
      } = await axios.get(
        `${YOUTUBE_API_URL}/activities?key=${API_KEY}&channelId=${currentPlaying.channelInfo.id}&part=snippet,contentDetails&maxResults=20&type=video&videoId=${videoId}`
      );

      const parsedData: RecommendedVideos[] = await parseRecommendedData(
        items,
        videoId
      );

      return { parsedData };
    } else {
      console.error("Current playing information is not available");
      return { parsedData: [] }; // You might want to handle this case accordingly
    }
  }
);
