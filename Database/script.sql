USE [kdb]
GO
/****** Object:  Table [dbo].[Activities]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activities](
	[ActivityId] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](512) NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_Activities] PRIMARY KEY CLUSTERED 
(
	[ActivityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AppSessions]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[AppSessions](
	[SessionId] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NOT NULL,
	[SessionData] [nvarchar](1024) NULL,
	[Token] [varchar](64) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_Session] PRIMARY KEY CLUSTERED 
(
	[SessionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Drivers]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Drivers](
	[UserId] [bigint] NOT NULL,
	[LicenseNo] [varchar](20) NOT NULL,
	[ClassType] [varchar](10) NULL,
	[ExpiredDate] [datetime] NULL,
	[IssuedDate] [datetime] NULL,
	[IssuedPlace] [nvarchar](100) NULL,
 CONSTRAINT [PK_Drivers_1] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[JournalActivities]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalActivities](
	[JournalActivityId] [bigint] IDENTITY(1,1) NOT NULL,
	[JournalId] [bigint] NOT NULL,
	[UserId] [bigint] NOT NULL,
	[ActivityId] [bigint] NOT NULL,
	[ActivityDetail] [nvarchar](512) NULL,
	[ExtendedData] [xml] NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_JournalActivities] PRIMARY KEY CLUSTERED 
(
	[JournalActivityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[JournalAttachments]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[JournalAttachments](
	[AttachmentId] [bigint] IDENTITY(1,1) NOT NULL,
	[JournalId] [bigint] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Data] [varbinary](max) NULL,
	[DataBase64] [varchar](max) NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_JournalAttachments] PRIMARY KEY CLUSTERED 
(
	[AttachmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[JournalDrivers]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalDrivers](
	[JournalId] [bigint] NOT NULL,
	[UserId] [bigint] NOT NULL,
	[Description] [nvarchar](512) NULL,
	[Status] [tinyint] NOT NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_JournalTrucks] PRIMARY KEY CLUSTERED 
(
	[JournalId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[JournalLocations]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalLocations](
	[JournalId] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NOT NULL,
	[TruckId] [bigint] NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[Accuracy] [float] NOT NULL,
	[StopCount] [int] NOT NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_JournalLocations] PRIMARY KEY CLUSTERED 
(
	[JournalId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Journals]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Journals](
	[JournalId] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](512) NULL,
	[StartLocation] [nvarchar](255) NOT NULL,
	[StartLat] [float] NOT NULL,
	[StartLng] [float] NOT NULL,
	[EndLocation] [nvarchar](255) NOT NULL,
	[EndLat] [float] NOT NULL,
	[EndLng] [float] NOT NULL,
	[ActiveDate] [date] NOT NULL,
	[Status] [tinyint] NOT NULL,
	[ExtendedData] [xml] NOT NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_Journal] PRIMARY KEY CLUSTERED 
(
	[JournalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[JournalStopPoints]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalStopPoints](
	[JournalStopPointId] [bigint] IDENTITY(1,1) NOT NULL,
	[JournalId] [bigint] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](512) NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[ExtendedData] [xml] NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_Table_1] PRIMARY KEY CLUSTERED 
(
	[JournalStopPointId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Settings]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Settings](
	[SettingId] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_Config] PRIMARY KEY CLUSTERED 
(
	[SettingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Trucks]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Trucks](
	[TruckId] [bigint] IDENTITY(1,1) NOT NULL,
	[TruckName] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](512) NULL,
	[TruckNumber] [nvarchar](100) NOT NULL,
	[ExtendedData] [xml] NULL,
	[Status] [tinyint] NOT NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_Trucks] PRIMARY KEY CLUSTERED 
(
	[TruckId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Users]    Script Date: 11/17/2016 10:23:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [bigint] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Password] [varchar](100) NOT NULL,
	[Role] [tinyint] NOT NULL,
	[ResetPassword] [bit] NOT NULL,
	[Status] [tinyint] NOT NULL,
	[FirstName] [nvarchar](255) NOT NULL,
	[LastName] [nvarchar](255) NOT NULL,
	[SSN] [varchar](12) NULL,
	[Address] [nvarchar](512) NULL,
	[DOB] [datetime] NULL,
	[Phone] [varchar](20) NULL,
	[Email] [varchar](255) NULL,
	[Note] [varchar](512) NULL,
	[ExtendedData] [xml] NULL,
	[CreatedTS] [datetime] NOT NULL,
	[LastUpdatedTS] [datetime] NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[AppSessions] ON 

INSERT [dbo].[AppSessions] ([SessionId], [UserId], [SessionData], [Token], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (1, 2, NULL, N'e536edbd26a943498397e4ab74e5c7d5', 2, CAST(0x0000A6C000E66514 AS DateTime), CAST(0x0000A6C000E66514 AS DateTime))
INSERT [dbo].[AppSessions] ([SessionId], [UserId], [SessionData], [Token], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (2, 2, NULL, N'e00d660e285f41b29021599ef39a2fea', 1, CAST(0x0000A6C000E725FD AS DateTime), CAST(0x0000A6C000E725FD AS DateTime))
INSERT [dbo].[AppSessions] ([SessionId], [UserId], [SessionData], [Token], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (3, 2, NULL, N'3f4ce0e281d143bd8a79eee6c866172a', 1, CAST(0x0000A6C000E7B29B AS DateTime), CAST(0x0000A6C000EAD7F6 AS DateTime))
SET IDENTITY_INSERT [dbo].[AppSessions] OFF
INSERT [dbo].[Drivers] ([UserId], [LicenseNo], [ClassType], [ExpiredDate], [IssuedDate], [IssuedPlace]) VALUES (1, N'1111111111', N'B2', CAST(0x0000A85B00000000 AS DateTime), CAST(0x00009CF100000000 AS DateTime), N'Saigon')
INSERT [dbo].[Drivers] ([UserId], [LicenseNo], [ClassType], [ExpiredDate], [IssuedDate], [IssuedPlace]) VALUES (2, N'2222222222', N'B2', CAST(0x0000A85B00000000 AS DateTime), CAST(0x00009CF100000000 AS DateTime), N'Saigon')
INSERT [dbo].[Drivers] ([UserId], [LicenseNo], [ClassType], [ExpiredDate], [IssuedDate], [IssuedPlace]) VALUES (3, N'3333333333', N'B2', CAST(0x0000A85B00000000 AS DateTime), CAST(0x00009CF100000000 AS DateTime), N'Saigon')
SET IDENTITY_INSERT [dbo].[Trucks] ON 

INSERT [dbo].[Trucks] ([TruckId], [TruckName], [Description], [TruckNumber], [ExtendedData], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (1, N'Xe Bán Tải 1', N'Test', N'B-0001', NULL, 0, CAST(0x0000A6B100000000 AS DateTime), CAST(0x0000A6B100000000 AS DateTime))
INSERT [dbo].[Trucks] ([TruckId], [TruckName], [Description], [TruckNumber], [ExtendedData], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (2, N'Xe Bán Tải 2', N'Test', N'B-0002', NULL, 0, CAST(0x0000A6B100000000 AS DateTime), CAST(0x0000A6B100000000 AS DateTime))
INSERT [dbo].[Trucks] ([TruckId], [TruckName], [Description], [TruckNumber], [ExtendedData], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (3, N'Xe Container 1', N'Test', N'C-0002', NULL, 0, CAST(0x0000A6B100000000 AS DateTime), CAST(0x0000A6B100000000 AS DateTime))
INSERT [dbo].[Trucks] ([TruckId], [TruckName], [Description], [TruckNumber], [ExtendedData], [Status], [CreatedTS], [LastUpdatedTS]) VALUES (4, N'Xe Container 2', N'Test', N'C-0003', NULL, 0, CAST(0x0000A6B100000000 AS DateTime), CAST(0x0000A6B100000000 AS DateTime))
SET IDENTITY_INSERT [dbo].[Trucks] OFF
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([UserId], [Username], [Password], [Role], [ResetPassword], [Status], [FirstName], [LastName], [SSN], [Address], [DOB], [Phone], [Email], [Note], [ExtendedData], [CreatedTS], [LastUpdatedTS]) VALUES (1, N'Admin', N'3+oBLR65KWu2tCMiw+9O8lXUFKsQAp9Rk/R34hPi60Q=', 100, 0, 0, N'Admin', N'KA', N'000000000000', N'Address', CAST(0x0000794300000000 AS DateTime), N'0123456789', N'admin@gmail.com', N'Admin user', NULL, CAST(0x0000A6BA015F2BD0 AS DateTime), CAST(0x0000A6BA015F2BD4 AS DateTime))
INSERT [dbo].[Users] ([UserId], [Username], [Password], [Role], [ResetPassword], [Status], [FirstName], [LastName], [SSN], [Address], [DOB], [Phone], [Email], [Note], [ExtendedData], [CreatedTS], [LastUpdatedTS]) VALUES (2, N'User1', N'3+oBLR65KWu2tCMiw+9O8lXUFKsQAp9Rk/R34hPi60Q=', 0, 0, 0, N'Test', N'User 1', N'111111111111', N'Address', CAST(0x0000806800000000 AS DateTime), N'1111111111', N'user1@mail.com', N'Test User', NULL, CAST(0x0000A6BA00000000 AS DateTime), CAST(0x00009E8C011826C0 AS DateTime))
INSERT [dbo].[Users] ([UserId], [Username], [Password], [Role], [ResetPassword], [Status], [FirstName], [LastName], [SSN], [Address], [DOB], [Phone], [Email], [Note], [ExtendedData], [CreatedTS], [LastUpdatedTS]) VALUES (3, N'User2', N'3+oBLR65KWu2tCMiw+9O8lXUFKsQAp9Rk/R34hPi60Q=', 0, 0, 0, N'Test', N'User 2', N'222222222222', N'Address', CAST(0x0000806800000000 AS DateTime), N'2222222222', N'user2@mail.com', N'Test User', NULL, CAST(0x0000A6BA00000000 AS DateTime), CAST(0x00009E8C011826C0 AS DateTime))
INSERT [dbo].[Users] ([UserId], [Username], [Password], [Role], [ResetPassword], [Status], [FirstName], [LastName], [SSN], [Address], [DOB], [Phone], [Email], [Note], [ExtendedData], [CreatedTS], [LastUpdatedTS]) VALUES (4, N'User3', N'3+oBLR65KWu2tCMiw+9O8lXUFKsQAp9Rk/R34hPi60Q=', 0, 0, 0, N'Test', N'User 3', N'333333333333', N'Address', CAST(0x0000806800000000 AS DateTime), N'3333333333', N'user3@mail.com', N'Test User', NULL, CAST(0x0000A6BA00000000 AS DateTime), CAST(0x00009E8C011826C0 AS DateTime))
SET IDENTITY_INSERT [dbo].[Users] OFF
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_User_ResetPassword]  DEFAULT ((0)) FOR [ResetPassword]
GO
ALTER TABLE [dbo].[AppSessions]  WITH CHECK ADD  CONSTRAINT [FK_Session_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[AppSessions] CHECK CONSTRAINT [FK_Session_Users]
GO
ALTER TABLE [dbo].[Drivers]  WITH CHECK ADD  CONSTRAINT [FK_Drivers_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Drivers] CHECK CONSTRAINT [FK_Drivers_Users]
GO
ALTER TABLE [dbo].[JournalActivities]  WITH CHECK ADD  CONSTRAINT [FK_JournalActivities_Activities] FOREIGN KEY([ActivityId])
REFERENCES [dbo].[Activities] ([ActivityId])
GO
ALTER TABLE [dbo].[JournalActivities] CHECK CONSTRAINT [FK_JournalActivities_Activities]
GO
ALTER TABLE [dbo].[JournalActivities]  WITH CHECK ADD  CONSTRAINT [FK_JournalActivities_Journals] FOREIGN KEY([JournalId])
REFERENCES [dbo].[Journals] ([JournalId])
GO
ALTER TABLE [dbo].[JournalActivities] CHECK CONSTRAINT [FK_JournalActivities_Journals]
GO
ALTER TABLE [dbo].[JournalAttachments]  WITH CHECK ADD  CONSTRAINT [FK_JournalAttachments_Journals] FOREIGN KEY([JournalId])
REFERENCES [dbo].[Journals] ([JournalId])
GO
ALTER TABLE [dbo].[JournalAttachments] CHECK CONSTRAINT [FK_JournalAttachments_Journals]
GO
ALTER TABLE [dbo].[JournalDrivers]  WITH CHECK ADD  CONSTRAINT [FK_JournalDrivers_Journals] FOREIGN KEY([JournalId])
REFERENCES [dbo].[Journals] ([JournalId])
GO
ALTER TABLE [dbo].[JournalDrivers] CHECK CONSTRAINT [FK_JournalDrivers_Journals]
GO
ALTER TABLE [dbo].[JournalLocations]  WITH CHECK ADD  CONSTRAINT [FK_JournalLocations_Journals] FOREIGN KEY([JournalId])
REFERENCES [dbo].[Journals] ([JournalId])
GO
ALTER TABLE [dbo].[JournalLocations] CHECK CONSTRAINT [FK_JournalLocations_Journals]
GO
ALTER TABLE [dbo].[JournalLocations]  WITH CHECK ADD  CONSTRAINT [FK_JournalLocations_Trucks] FOREIGN KEY([TruckId])
REFERENCES [dbo].[Trucks] ([TruckId])
GO
ALTER TABLE [dbo].[JournalLocations] CHECK CONSTRAINT [FK_JournalLocations_Trucks]
GO
ALTER TABLE [dbo].[JournalStopPoints]  WITH CHECK ADD  CONSTRAINT [FK_JournalStopPoints_Journals] FOREIGN KEY([JournalId])
REFERENCES [dbo].[Journals] ([JournalId])
GO
ALTER TABLE [dbo].[JournalStopPoints] CHECK CONSTRAINT [FK_JournalStopPoints_Journals]
GO
