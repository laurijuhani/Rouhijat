-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invited_emails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "invited_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "home_score" INTEGER,
    "away_score" INTEGER,
    "game_date" TIMESTAMP(3) NOT NULL,
    "seasonid" INTEGER NOT NULL,
    "goalieid" INTEGER,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "number" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goalies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "number" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "goalies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points" (
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "pm" INTEGER NOT NULL,

    CONSTRAINT "points_pkey" PRIMARY KEY ("player_id","game_id")
);

-- CreateTable
CREATE TABLE "ig_profiles" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "profile_pic_url" TEXT NOT NULL,
    "profile_pic_url_hd" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "number_of_posts" INTEGER NOT NULL,

    CONSTRAINT "ig_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_posts" (
    "id" TEXT NOT NULL,
    "taken_at_timestamp" INTEGER NOT NULL,
    "comment_count" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "caption" TEXT NOT NULL,

    CONSTRAINT "ig_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_pictures" (
    "id" TEXT NOT NULL,
    "display_url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "ig_pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ig_videos" (
    "id" TEXT NOT NULL,
    "display_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "ig_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_posts" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "images" TEXT[],

    CONSTRAINT "history_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invited_emails_email_key" ON "invited_emails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_name_key" ON "seasons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ig_profiles_username_key" ON "ig_profiles"("username");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_goalieid_fkey" FOREIGN KEY ("goalieid") REFERENCES "goalies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_seasonid_fkey" FOREIGN KEY ("seasonid") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ig_pictures" ADD CONSTRAINT "ig_pictures_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "ig_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ig_videos" ADD CONSTRAINT "ig_videos_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "ig_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
