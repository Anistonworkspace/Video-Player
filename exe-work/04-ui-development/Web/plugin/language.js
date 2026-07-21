//# sourceURL=language.js
function lan(a) {
	var b = null;
	function translateLang(){
		if (a == "login") {
			loginBtn.innerHTML = lg.get("IDS_SERVER_LOGIN");
			ForgetPwd.innerHTML=lg.get("IDS_FORGET_PWD");
			DownloadLink.innerHTML=lg.get("Download plugin");
			if(WebCms.web.webstyle == "JvFeng" || WebCms.web.webstyle == "JF"){
				LoginText.innerHTML=lg.get("IDS_LOGIN_LOGO_TEXT");
			}else{
				LoginTitle.innerHTML=lg.get("IDS_SERVER_LOGIN");
			}
		}else if(a == "forgetpwd"){
			ResetTypeL.innerHTML = lg.get("IDS_RESET_TYPE");
			securitques_tip.innerHTML = lg.get("IDS_INPUT_ANSWER");
			question1L.innerHTML = lg.get("IDS_QUESTION");
			question2L.innerHTML = lg.get("IDS_QUESTION");
			answer1L.innerHTML = lg.get("IDS_ANSWER");
			answer2L.innerHTML = lg.get("IDS_ANSWER");
			QRTipsInfo.innerHTML = lg.get("IDS_QR_TIPS");
			verificationCode.innerHTML = lg.get("IDS_VERIFY_CODE");
			CodeInfoL.innerHTML = lg.get("IDS_VERIFY_CODE");
			Reset_tip.innerHTML = lg.get("IDS_RESET_ADMIN");
			user_name.innerHTML = lg.get("IDS_USERNAME");
			New_Password.innerHTML = lg.get("IDS_NEW_PWD");
			Confirm_Password.innerHTML = lg.get("IDS_CONFIRM_PWD");
			Confirm_Ques.innerHTML=lg.get("IDS_OK");
			Confirm_Code.innerHTML=lg.get("IDS_OK");
			SavePWD.innerHTML=lg.get("IDS_OK");
			btn_cancle.innerHTML=lg.get("IDS_CANCEL");
		}else if(a == "live"){
			if(WebCms.web.webstyle == "JvFeng" || WebCms.web.webstyle == "JF"){
				LogoMainTitle.innerHTML=lg.get("IDS_LOGIN_LOGO_TEXT");
			}
			TalkTitle.innerHTML = lg.get("IDS_LIVE_Talking");
			SpeedTitle.innerHTML = lg.get("IDS_LIVE_Speed");
			ElectSpeed.innerHTML = lg.get("IDS_LIVE_ElectSpeed");
			ZoomTitle.innerHTML = lg.get("IDS_LIVE_Zoom");
			FocusTitle.innerHTML = lg.get("IDS_LIVE_Focus");
			IrisTitle.innerHTML = lg.get("IDS_LIVE_Iris");
			PresetTitle.innerHTML = lg.get("IDS_LIVE_Preset");
			TourTitle.innerHTML = lg.get("IDS_LIVE_Tour");
			SetDefault.innerHTML = lg.get("IDS_LIVE_Default");	
			DlgTitle.innerHTML = lg.get("IDS_LIVE_TourRoad");
			CruiseLine.innerHTML = lg.get("IDS_LIVE_TourRoad");
			PresetPoint.innerHTML = lg.get("IDS_LIVE_Preset");
			Interval.innerHTML = lg.get("IDS_EMAIL_TIME");
			btnAddPoint.innerHTML = lg.get("IDS_LIVE_AddPreset");
			btnClearPoint.innerHTML = lg.get("IDS_LIVE_DelPreset");
			btnClearLine.innerHTML = lg.get("IDS_LIVE_ClearTour");
			Stream_Main.innerHTML = lg.get("IDS_FULL_MAINSTREAM");
			Stream_Extra.innerHTML = lg.get("IDS_FULL_SUBSTREAM");
			Stream_Stop.innerHTML = lg.get("IDS_ALLCHANNEL_STOP");
			TalkChannel.innerHTML = lg.get("IDS_AUTH_Talk_Channel");
			TalkDevice.innerHTML = lg.get("IDS_AUTH_Talk_Device");
			ElectTitle.innerHTML = lg.get("IDS_LIVE_Preset");
			SystemStatus_AppMemory.innerHTML = lg.get("IDS_TOOL_MEMORY");
			SystemStatus_SystemCpu.innerHTML = lg.get("IDS_SYSTEM_CPU");
			LMirror.innerHTML = lg.get("IDS_PTZ_MIRROR");
			LFlip.innerHTML = lg.get("IDS_PTZ_FLIP");
			BroadcastChn.innerHTML = lg.get("IDS_Broadcast");
		}else if(a == "playback"){
			playbackL.innerHTML = lg.get("IDS_PBK");
			queryMode.innerHTML = lg.get("IDS_PBK_QueryMode");
			ByNameLab.innerHTML = lg.get("IDS_PBK_ByName");
			ByTimeLab.innerHTML = lg.get("IDS_PBK_ByTime");
			TypeL.innerHTML = lg.get("IDS_PBK_Type");
			StartTimeL.innerHTML = lg.get("IDS_PBK_StartTime");
			EndTimeL.innerHTML = lg.get("IDS_PBK_EndTime");
			StreamModeL.innerHTML = lg.get("IDS_PBK_Stream");
			SyncModeL.innerHTML = lg.get("IDS_PBK_SYNCMODE");
			ChannelL.innerHTML = lg.get("IDS_CHANNEL");
			BtnSearch.innerHTML = lg.get("IDS_PBK_Search");
			List_No.innerHTML = lg.get("IDS_PBK_ListNo");
			List_File.innerHTML = lg.get("IDS_PBK_ListFile");
			GotoSearch.innerHTML = lg.get("IDS_PBK_Search");
			BtnPlay.innerHTML = lg.get("IDS_LIVE_Play");
			PageUp.innerHTML = lg.get("IDS_PRE_PAGE");
			PageDown.innerHTML = lg.get("IDS_NEXT_PAGE");
			BtnDownload.innerHTML = lg.get("IDS_DOWNLOAD");
			BtnCancelDownload.innerHTML = lg.get("IDS_CANCEL_DOWNLOAD");
		}else if(a == "alarm"){
			AlarmType.innerHTML = lg.get("IDS_ALARMTYPE");
			typeAll.innerHTML = lg.get("IDS_CFG_ALL");
			Motion.innerHTML = lg.get("IDS_VIDEO_MOTION");
			Blind.innerHTML = lg.get("IDS_VIDEO_BLIND");
			Loss.innerHTML = lg.get("IDS_VIDEO_LOSS");
			IOAlarm.innerHTML = lg.get("IDS_IO_TRIGGER");
			Video_Analyze.innerHTML = lg.get("IDS_RECTYPE_SMART");
			Human.innerHTML = lg.get("IDS_HUMAN_DETECT");
			FaceDetect.innerHTML = lg.get("IDS_ALARM_FACE");
			Disk_Error.innerHTML = lg.get("IDS_DISK_ERROR");
			Disk_Full.innerHTML = lg.get("IDS_DISK_FULL");
			OperationL.innerHTML = lg.get("IDS_ALARM_OPERATION");
			PromptL.innerHTML = lg.get("IDS_ALARM_PROMPT");
			Alarm_No.innerHTML = lg.get("IDS_LOG_NO");
			Alarm_Time.innerHTML = lg.get("IDS_TIME");
			Alarm_Type.innerHTML = lg.get("IDS_ALARMTYPE");
			Alarm_Channel.innerHTML = lg.get("IDS_CHANNEL");
			Car_shape.innerHTML=lg.get("CarShapeDetect");
			Falldown.innerHTML = lg.get("IDS_FALLDOWN");
		}else if(a == "client"){
			recordFile.innerHTML = lg.get("IDS_RECORD_PATH");
			captureImg.innerHTML = lg.get("IDS_CAPTURE_PATH");
			downloadFile.innerHTML = lg.get("IDS_DOWNLOAD_PATH");
			pathSave.innerHTML = lg.get("IDS_SAVE");
			PathBtn_2.innerHTML = lg.get("IDS_UPDATE_BROWSE");
			PathBtn_1.innerHTML = lg.get("IDS_UPDATE_BROWSE");
			PathBtn_0.innerHTML = lg.get("IDS_UPDATE_BROWSE");
			PathConfig_Btn.innerHTML = lg.get("IDS_CLIENT_PATH");
			Version_Btn.innerHTML = lg.get("IDS_CLIENT_VERSION");
			ToolVersion.innerHTML = lg.get("IDS_CLIENT_ToolVersion");
			WebVersion.innerHTML = lg.get("IDS_CLIENT_WebVersion");
			CheckVersionBtn.innerHTML = lg.get("IDS_CLIENT_Check");
			DownloadBtn.innerHTML = lg.get("IDS_DOWNLOAD");
			RecordType.innerHTML = lg.get("IDS_CLIENT_RECORDTYPE");
			imageType.innerHTML = lg.get("IDS_CLIENT_IMAGETYPE");
			videoType.innerHTML = lg.get("IDS_CLIENT_VIDEOTYPE");
			UpdateStatus.innerHTML = lg.get("IDS_CLIENT_UPGRADESTATUS");
			SoftwareLicenses.innerHTML = lg.get("IDS_SoftwareLicense");		
		}else if (a == "config") {
			configBtn.innerHTML = lg.get("IDS_SYS_SET");
			
			//	Record
			mRecordL.innerHTML = lg.get("IDS_REC_RECORD");
			Record_Manager.innerHTML = lg.get("IDS_REC_PARAM");
			Record_Manager_jh.innerHTML = lg.get("IDS_REC_PARAM");
			Record_Snap.innerHTML = lg.get("IDS_REC_SNAP");
			Record_SnapSchedule.innerHTML = lg.get("IDS_REC_SNAPSCHE");
			Record_Ctrl.innerHTML = lg.get("IDS_REC_CTRL");
	
			//	Alarm
			mAlarmL.innerHTML = lg.get("IDS_ALARM_PARAM");
			if(gDevice.Ability.AlarmFunction.HumanDection || gDevice.Ability.AlarmFunction.HumanDectionNVRNew){
				Alarm_Motion.innerHTML = lg.get("IDS_INTELL_MOTION");
			}else{
				Alarm_Motion.innerHTML = lg.get("IDS_VIDEO_MOTION");
			}
			Alarm_SmartAlarm.innerHTML=lg.get("IDS_INTELL_MOTION");
			Alarm_VideoBlind.innerHTML = lg.get("IDS_VIDEO_BLIND");
			Alarm_FaceDetect.innerHTML = lg.get("IDS_ALARM_FACE");
			Alarm_VideoLoss.innerHTML = lg.get("IDS_VIDEO_LOSS");
			Alarm_Input.innerHTML = lg.get("IDS_ALARM_INPUT");
			Alarm_Output.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			Alarm_Intelligent.innerHTML = lg.get("IDS_PARAM_INTELLIGENT");
			Alarm_HumanDetect.innerHTML = lg.get("IDS_HUMAN_DETECT");
			Alarm_CarShape.innerHTML=lg.get("CarShapeDetect");
	
			//	System
			mSystemL.innerHTML = lg.get("IDS_SYSTEM");
			System_General.innerHTML = lg.get("IDS_SYSTEM_GENERAL");
			System_CameraParam.innerHTML = lg.get("IDS_SYSTEM_CAMERAPARAM");
			System_CameraParam_Simp.innerHTML = lg.get("IDS_SYSTEM_CAMERAPARAM");
			System_ColorParam.innerHTML = lg.get("IDS_SYSTEM_COLORPARAM");
			System_Encode.innerHTML = lg.get("IDS_SYSTEM_ENCODE");
			System_Network.innerHTML = lg.get("IDS_SYSTEM_NETWORK");
			System_NetService.innerHTML = lg.get("IDS_SYSTEM_NETSERVICE");
			System_Display.innerHTML = lg.get("IDS_SYSTEM_DISPLAY");
			System_PTZ.innerHTML = lg.get("IDS_SYSTEM_PTZ");
			System_Serial.innerHTML = lg.get("IDS_SYSTEM_SERIAL");
			System_NetworkIPV6.innerHTML = lg.get("IDS_SYSTEM_IPV6");

			// IPCParam
			System_IPCParam.innerHTML = lg.get("IDS_CAM_IPCParam");
			IPCParam_VersionL.innerHTML = lg.get("IDS_INFO_VERSION");
			IPCParam_ImageSetL.innerHTML = lg.get("IDS_CAM_ImageSet");
			IPCParam_AdvancedL.innerHTML = lg.get("IDS_ADVANCE");
			IPCParam_MaintainL.innerHTML = lg.get("IDS_CAM_SystemMaintain");
			IPCParam_LightSetL.innerHTML = lg.get("IDS_CAM_LightSet");
			
			//	Advanced
			mAdvancedL.innerHTML = lg.get("IDS_ADV");
			Advance_HddManager.innerHTML = lg.get("IDS_ADV_HDDMANAGER");
			Advance_Account.innerHTML = lg.get("IDS_ADV_ACCOUNT")
			Advance_AutoMaintain.innerHTML = lg.get("IDS_ADV_AUTOMAINTAIN");
			Advance_Default.innerHTML = lg.get("IDS_ADV_DEFAULT");
			Advance_ImportEx.innerHTML = lg.get("IDS_ADV_IMPORT_EXPORT")
			Advance_Reboot.innerHTML = lg.get("IDS_ADV_REBOOT");
			Advance_ChannelType.innerHTML = lg.get("IDS_ADV_CHANNELTYPE");
			Advance_Digital.innerHTML = lg.get("IDS_ADV_DIGITAL");
			Advance_Upgrade.innerHTML = lg.get("IDS_ADV_UPGRAUDE");
			Alarm_Exception.innerHTML = lg.get("IDS_ABNORMITY_ALARM");
			//	Info
			mInfoL.innerHTML = lg.get("IDS_INFO");
			Info_HddInfo.innerHTML = lg.get("IDS_INFO_HDD");
			Info_Log.innerHTML = lg.get("IDS_INFO_LOG");
			Info_CustomerFlow.innerHTML = lg.get("IDS_CustomerFlowCount");
			Info_Version.innerHTML = lg.get("IDS_INFO_VERSION");
			Info_ChanStatus.innerHTML = lg.get("IDS_INFO_CHANNELSTATUS");
			Info_QR.innerHTML = lg.get("IDS_QRCode");
		}else if (a == "Record_Manager") {
			rec_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			RecordModeL.innerHTML = lg.get("IDS_REC_MODE");
			RedundancyL.innerHTML = lg.get("IDS_REC_REDUNDANCY");
			SDL.innerHTML = lg.get("IDS_REC_SD");
			USBL.innerHTML = lg.get("IDS_REC_USB")
			PacketLengthL.innerHTML = lg.get("IDS_REC_LEN");
			PreRecordL.innerHTML = lg.get("IDS_REC_PRERECORD");
			AutoL.innerHTML = lg.get("IDS_REC_AUTO");
			ManualL.innerHTML = lg.get("IDS_REC_MANUAL");
			ClosedL.innerHTML = lg.get("IDS_REC_CLOSED");
			NormalTip.innerHTML = lg.get("IDS_REC_GENERAL");
			MotionTip.innerHTML = lg.get("IDS_REC_DETECT");
			AlarmTip.innerHTML = lg.get("IDS_REC_ALARM");
			PacketLengthMin.innerHTML = lg.get("IDS_GEN_Minute");
			PreRecordSec.innerHTML = lg.get("IDS_SEC");
			RECWeekL.innerHTML = lg.get("IDS_WD");
			Sect1L.innerHTML = lg.get("IDS_TIMESECTION1");
			Sect2L.innerHTML = lg.get("IDS_TIMESECTION2");
			Sect3L.innerHTML = lg.get("IDS_TIMESECTION3");
			Sect4L.innerHTML = lg.get("IDS_TIMESECTION4");
			BreviaryTip.innerHTML = lg.get("IDS_REC_BREVIARY");
			BreviaryL.innerHTML = lg.get("IDS_ENABLE");
			RECconfigRF.innerHTML = lg.get("IDS_REFRESH");
			RECconfigSave.innerHTML = lg.get("IDS_SAVE");
			RECconfigCP.innerHTML = lg.get("IDS_Copy");
			RECconfigPA.innerHTML = lg.get("IDS_PASTE");
			NoHandle_RecordModeL.innerHTML = lg.get("IDS_REC_MODE");
			NormalL.innerHTML = lg.get("IDS_REC_GENERAL");
			AlarmL.innerHTML = lg.get("IDS_REC_ALARM");
			ClosedL2.innerHTML = lg.get("IDS_REC_CLOSED");
			RECconfigDE.innerHTML = lg.get("IDS_Default");
		}else if(a == "Record_Manager_jh"){
			rec_channel_num.innerHTML = lg.get("IDS_CHANNEL");	
			rec_copyDay.innerHTML = lg.get("IDS_COPYDAY");
			COPY_WEEK_TO.innerHTML = lg.get("IDS_COPY_TO");
			LXJH_CPXQQD.innerHTML = lg.get("IDS_Copy");			
			RECconfigRF.innerHTML = lg.get("IDS_REFRESH");
			RECconfigSave.innerHTML = lg.get("IDS_SAVE");
			RECconfigCP.innerHTML = lg.get("IDS_Copy");
			RECconfigPA.innerHTML = lg.get("IDS_PASTE");
			RECconfigDE.innerHTML = lg.get("IDS_Default");
		}else if(a == "Record_Snap"){
			Snap_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			PreCaptureL.innerHTML = lg.get("IDS_CAP_PRESNAP");
			PictureL.innerHTML = lg.get("IDS_CAP_PICTURE");
			SnapModeL.innerHTML = lg.get("IDS_CAP_MODE");
			SnapAutoL.innerHTML = lg.get("IDS_REC_AUTO");
			SnapManualL.innerHTML = lg.get("IDS_REC_MANUAL");
			SnapClosedL.innerHTML = lg.get("IDS_REC_CLOSED");
			SnapWeekL.innerHTML = lg.get("IDS_WD");
			SnapNormalTip.innerHTML = lg.get("IDS_REC_GENERAL");
			SnapMotionTip.innerHTML = lg.get("IDS_REC_DETECT");
			SnapAlarmTip.innerHTML = lg.get("IDS_REC_ALARM");
			SnapSect1L.innerHTML = lg.get("IDS_TIMESECTION1");
			SnapSect2L.innerHTML = lg.get("IDS_TIMESECTION2");
			SnapSect3L.innerHTML = lg.get("IDS_TIMESECTION3");
			SnapSect4L.innerHTML = lg.get("IDS_TIMESECTION4");
			SnapRF.innerHTML = lg.get("IDS_REFRESH");
			SnapSave.innerHTML = lg.get("IDS_SAVE");
			SnapCP.innerHTML = lg.get("IDS_Copy");
			SnapPA.innerHTML = lg.get("IDS_PASTE");
			SnapDefault.innerHTML = lg.get("IDS_Default");
		}else if (a == "Record_SnapSchedule") {
			SnapCon_BreviaryL.innerHTML = lg.get("IDS_REC_BREVIARY");
			SnapCon_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			IntervalTypeL.innerHTML = lg.get("IDS_SNAPS_INTERVAL");
			TriggerTypeL.innerHTML = lg.get("IDS_SNAPS_UPLOADING");
			CloseL.innerHTML = lg.get("IDS_SNAPS_CLOSE");
			IntervalStoL.innerHTML = lg.get("IDS_SNAPS_PICSTORAGE");
			TriggerStoL.innerHTML = lg.get("IDS_SNAPS_PICSTORAGE");
			UploadTL.innerHTML = lg.get("IDS_SNAPS_TIMEPOINT");
			EmailSec.innerHTML =lg.get("IDS_SEC");
			FTPSec.innerHTML = lg.get("IDS_SEC");
			StoSec.innerHTML = lg.get("IDS_SEC");
			SnapScheRF.innerHTML = lg.get("IDS_REFRESH");
			SnapScheSave.innerHTML = lg.get("IDS_SAVE");
			TriggerAdd.innerHTML = lg.get("IDS_SNAPS_ADD");
			TriggerDel.innerHTML = lg.get("IDS_SNAPS_DEL");
			Head_No.innerHTML = lg.get("IDS_SNAPS_No");
			Head_SnapTime.innerHTML = lg.get("IDS_SNAPS_TIMEPOINT");
			IntervalEmailL.innerHTML = lg.get("IDS_SNAPS_Email");
			TriggerEmailL.innerHTML = lg.get("IDS_SNAPS_Email");
			Head_Email.innerHTML = lg.get("IDS_SNAPS_Email");
			IntervalFTPL.innerHTML = lg.get("IDS_SNAPS_Ftp");
			TriggerFTPL.innerHTML = lg.get("IDS_SNAPS_Ftp");
			Head_Ftp.innerHTML = lg.get("IDS_SNAPS_Ftp");
			Head_ImageStorage.innerHTML = lg.get("IDS_SNAPS_PICSTORAGE");
		}else if(a == "Record_Ctrl"){
			Record_Mode.innerHTML = lg.get("IDS_REC_MODE");
			Main_Auto.innerHTML = lg.get("IDS_CTRL_AUTO");
			Ext_Auto.innerHTML = lg.get("IDS_CTRL_AUTO");
			Main_Manual.innerHTML = lg.get("IDS_CTRL_MANUAL");
			Ext_Manual.innerHTML = lg.get("IDS_CTRL_MANUAL");
			Main_Stop.innerHTML = lg.get("IDS_REC_CLOSED");
			Ext_Stop.innerHTML = lg.get("IDS_REC_CLOSED");
			ExtTip.innerHTML = lg.get("IDS_EXTSREAM");
			RecCtrlRf.innerHTML = lg.get("IDS_REFRESH");
			RecCtrlSave.innerHTML = lg.get("IDS_SAVE");
			RecCtrlNext.innerHTML = lg.get("IDS_NEXT_PAGE");
		}else if (a == "Alarm_Motion") {
			channels_num_1.innerHTML = lg.get("IDS_CHANNEL");
			start_move_sense.innerHTML = lg.get("IDS_ENABLE");
			sense_grade.innerHTML = lg.get("IDS_SSV");
			mo_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			RegionL.innerHTML = lg.get("IDS_Region");
			RegionSet.innerHTML = lg.get("IDS_SETTING");
			MV_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			MV_Period.innerHTML = lg.get("IDS_SETTING");
			MVEventLatchL.innerHTML = lg.get("IDS_ALARM_INTERVAL");
			MVAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			MVAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			MVrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			MVtour_channel.innerHTML = lg.get("IDS_ALARM_TOUR");
			MVsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");
			MVRecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
			MV_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			MV_PTZSet.innerHTML = lg.get("IDS_SETTING");
			MVshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			MVsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			MVPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			MVFTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			MVWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");	
			MVVoiceL.innerHTML = lg.get("IDS_ALARM_SOUND");
			mo_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			MVRf.innerHTML = lg.get("IDS_REFRESH");
			MVSave.innerHTML = lg.get("IDS_SAVE");
			MVCP.innerHTML = lg.get("IDS_Copy");
			MVPaste.innerHTML = lg.get("IDS_PASTE");
			MVLatchSec.innerHTML = lg.get("IDS_SEC") + " (0-600)";
			MVAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			MVRecordSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			MV_IPCLinkL.innerHTML = lg.get("IDS_IPC_LINK");
			MV_IPCLink.innerHTML = lg.get("IDS_SETTING");
			MV_HumanEnableL.innerHTML = lg.get("IDS_HUMAN_DETECT");		
			VoiceTipL.innerHTML = lg.get("IDS_VOICE_PROMPT");
			VoiceTipBtn.innerHTML = lg.get("IDS_CUSTOM");
			VoiceIntervalL.innerHTML = lg.get("IDS_VOICE_INTERVAL");
			VoiceIntervalSec.innerHTML = lg.get("IDS_SEC") + " (0-3599)";
			MVRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			MVTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			MVSnapL.innerHTML=lg.get("IDS_ALARM_SNAP_CHANNEL");
			MVDefault.innerHTML = lg.get("IDS_Default");
		}else if (a == "Alarm_VideoBlind") {
			channels_num.innerHTML = lg.get("IDS_CHANNEL");
			bl_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			start_sense.innerHTML = lg.get("IDS_ENABLE");
			sense_grade.innerHTML = lg.get("IDS_SSV");
			VB_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			VB_Period.innerHTML = lg.get("IDS_SETTING");
			VBAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			VBAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			VBrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			VBtour_channel.innerHTML = lg.get("IDS_ALARM_TOUR");
			VBsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");	
			VBRecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
			VB_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			VB_PTZSet.innerHTML = lg.get("IDS_SETTING");
			VBshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			VBsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			VBPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			VBFTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			VBWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			bl_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");		
			VBRf.innerHTML = lg.get("IDS_REFRESH");
			VBSave.innerHTML = lg.get("IDS_SAVE");
			VBCP.innerHTML = lg.get("IDS_Copy");
			VBPaste.innerHTML = lg.get("IDS_PASTE");
			VBAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			VBRecordSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			VBRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			VBTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			VBSnapL.innerHTML=lg.get("IDS_ALARM_SNAP_CHANNEL");
			VBDefault.innerHTML = lg.get("IDS_Default");
		}else if (a == "Alarm_FaceDetect") {
			FD_ChannelNum.innerHTML = lg.get("IDS_CHANNEL");
			FDEnableL.innerHTML = lg.get("IDS_ENABLE");	
			FD_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			FD_Period.innerHTML = lg.get("IDS_SETTING");
			FDAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			FDAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			FD_tour_1.innerHTML = lg.get("IDS_ALARM_TOUR");
			FD_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			fa_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			FD_PTZSet.innerHTML = lg.get("IDS_SETTING");
			FDshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			FDsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			FDPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			FDWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			fa_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			FD_Rf.innerHTML = lg.get("IDS_REFRESH");
			FD_SV.innerHTML = lg.get("IDS_SAVE");
			FD_CP.innerHTML = lg.get("IDS_Copy");
			FD_Paste.innerHTML = lg.get("IDS_PASTE");
			FDAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			FDTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			FD_Default.innerHTML = lg.get("IDS_Default");
		}else if(a == "Alarm_VideoLoss"){
			channels_num.innerHTML = lg.get("IDS_CHANNEL");
			start_sense.innerHTML = lg.get("IDS_ENABLE");
			lo_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			VL_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			VL_Period.innerHTML = lg.get("IDS_SETTING");
			VLAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			VLAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			VLrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			VLtour_channel.innerHTML = lg.get("IDS_ALARM_TOUR");
			VLsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");	
			VLRecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
			VL_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			VL_PTZSet.innerHTML = lg.get("IDS_SETTING");
			VLshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			VLsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			VLPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			VLFTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			VLWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			lo_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			VLRf.innerHTML = lg.get("IDS_REFRESH");
			VLSave.innerHTML = lg.get("IDS_SAVE");
			VLCP.innerHTML = lg.get("IDS_Copy");
			VLPaste.innerHTML = lg.get("IDS_PASTE");
			VLAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			VLRecordSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			VLRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			VLTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			VLSnapL.innerHTML=lg.get("IDS_ALARM_SNAP_CHANNEL");
			VLDefault.innerHTML = lg.get("IDS_Default");
		}else if (a == "Alarm_Input") {
			alarm_type.innerHTML = lg.get("IDS_ALARM_TYPE");
			alarm_channel.innerHTML = lg.get("IDS_CHANNEL");
			in_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			alarm_enable.innerHTML = lg.get("IDS_ENABLE");
			alarm_dev_type.innerHTML = lg.get("IDS_ALARM_DEV_TYPE");
			IN_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			IN_Period.innerHTML = lg.get("IDS_SETTING");
			INEventLatchL.innerHTML = lg.get("IDS_ALARM_INTERVAL");
			INAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			INAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			INrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			INtour_channel.innerHTML = lg.get("IDS_ALARM_TOUR");
			INsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");	
			INRecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
			IN_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			IN_PTZSet.innerHTML = lg.get("IDS_SETTING");
			INshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			INsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			INPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			INFTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			INWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			INShortMsgL.innerHTML = lg.get("IDS_ALARM_SMS");
			INMultimediaL.innerHTML = lg.get("IDS_ALARM_MMS");
			in_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			INRf.innerHTML = lg.get("IDS_REFRESH");
			INSave.innerHTML = lg.get("IDS_SAVE");
			INCP.innerHTML = lg.get("IDS_Copy");
			INPaste.innerHTML = lg.get("IDS_PASTE");
			INLatchSec.innerHTML = lg.get("IDS_SEC") + " (0-600)";
			INAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			INRecordSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			INRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			INTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			INSnapL.innerHTML=lg.get("IDS_ALARM_SNAP_CHANNEL");
			INDefault.innerHTML = lg.get("IDS_Default");
		}else if(a == "Alarm_Output"){
			OutRf.innerHTML = lg.get("IDS_REFRESH");
			OutSave.innerHTML = lg.get("IDS_SAVE");
			Alarm_All.innerHTML = lg.get("IDS_CFG_ALL");
			Alarm_Mode.innerHTML = lg.get("IDS_Alarm_Mode");
			Alarm_Auto.innerHTML = lg.get("IDS_Alarm_AUTO");
			Alarm_Manual.innerHTML = lg.get("IDS_Alarm_Manual");
			Alarm_Stop.innerHTML = lg.get("IDS_REC_STOP");
			Alarm_Status.innerHTML = lg.get("IDS_Alarm_Status");
		}else if(a == "Alarm_Intelligent"){
			IntelligentChL.innerHTML = lg.get("IDS_CHANNEL");
			Intel_Switch.innerHTML = lg.get("IDS_ENABLE");
			ArithmeticL.innerHTML = lg.get("IDS_CA_ARITHMETIC");
			TraceSwitchL.innerHTML =lg.get("IDS_CA_ShowTrace");
			RuleSwitchL.innerHTML = lg.get("IDS_CA_ShowRule");
			RuleSetL.innerHTML = lg.get("IDS_CA_ALARMRULES");
			LinkSetL.innerHTML = lg.get("IDS_CA_RULELINK");
			RuleSet.innerHTML = lg.get("IDS_SETTING");
			LinkSet.innerHTML = lg.get("IDS_SETTING");
			IntelligentRf.innerHTML = lg.get("IDS_REFRESH");
			IntelligentSV.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "PEA_Zone"){
			TripWireL.innerHTML = lg.get("IDS_PEA_TRIPWIRE");
			PerimeterL.innerHTML = lg.get("IDS_PEA_PERIMETER");
			PZ_SV.innerHTML = lg.get("IDS_SAVE");
			PZ_Cancel.innerHTML = lg.get("IDS_CANCEL");
			ShowRuleL.innerHTML = lg.get("IDS_CA_ShowRule");
			ShowTraceL.innerHTML = lg.get("IDS_CA_ShowTrace");
			RuleBorderColorL.innerHTML = lg.get("IDS_PEA_RuleBorderColor");
			RuleBorderWidthL.innerHTML = lg.get("IDS_PEA_RuleBorderWidth");
		}else if(a == "OSC_Zone"){
			StolenL.innerHTML = lg.get("IDS_OSC_STOLEN");
			AbandumL.innerHTML = lg.get("IDS_OSC_ABANDUM");
			NoParkingL.innerHTML = lg.get("IDS_OSC_NOPARKING");
			GLL_SV.innerHTML = lg.get("IDS_SAVE");
			GLL_Cancel.innerHTML = lg.get("IDS_CANCEL");
		}else if(a == "AVD_dialog"){
			AVDSensitivityL.innerHTML = lg.get("IDS_SSV");
			AVD_ChangeL.innerHTML = lg.get("IDS_AVD_CHANGE");
			AVD_OK.innerHTML = lg.get("IDS_OK");
			AVD_cancle.innerHTML = lg.get("IDS_CANCEL");
		}else if (a == "Alarm_HumanDetect") {
			PD_ChannelNum.innerHTML = lg.get("IDS_CHANNEL");
			hu_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			PDChnSwitch.innerHTML = lg.get("IDS_PD_ENABLE");
			PDSensitive.innerHTML = lg.get("IDS_SSV");
			PDLoiterL.innerHTML = lg.get("IDS_PD_LOITERLATCH");		
			PDLightsL.innerHTML=lg.get("IDS_PD_LIGHTTS");
			PD_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			PD_Period.innerHTML = lg.get("IDS_SETTING");
			PDEventLatchL.innerHTML = lg.get("IDS_ALARM_INTERVAL");
			PDAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			PDAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			PDrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			PDtour_channel.innerHTML = lg.get("IDS_ALARM_TOUR");
			PDsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");	
			PDRecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
			PD_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			PD_PTZSet.innerHTML = lg.get("IDS_SETTING");
			PDshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			PDsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			PDPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			PDFTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			PDWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			PDVoiceL.innerHTML = lg.get("IDS_ALARM_SOUND");
			hu_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			PD_Rf.innerHTML = lg.get("IDS_REFRESH");
			PD_SV.innerHTML = lg.get("IDS_SAVE");
			PD_COPY.innerHTML = lg.get("IDS_Copy");
			PD_Paste.innerHTML = lg.get("IDS_PASTE");
			LoiterSec.innerHTML = lg.get("IDS_SEC") + " (1-50)";
			PDLatchSec.innerHTML = lg.get("IDS_SEC") + " (0-600)";
			PDAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			PDRecordSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			PDRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			PDTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			PDSnapL.innerHTML=lg.get("IDS_ALARM_SNAP_CHANNEL");
			PD_Default.innerHTML = lg.get("IDS_Default");
		}else if (a == "Advance_Upgrade") {
			upgrade_Local.innerHTML = lg.get("IDS_UPDATE_Local");
			upgrade_Online.innerHTML = lg.get("IDS_UPDATE_Online");
			upgrade_file_path.innerHTML = lg.get("IDS_UPDATE_PATH");
			UpgradeBtn.innerHTML = lg.get("IDS_UPDATE_SEND");
			updateWarming.innerHTML = lg.get("IDS_UP_WARMING");
			BrowseBtn.innerHTML = lg.get("IDS_UPDATE_BROWSE");
			GetNewOnlineVersion.innerHTML = lg.get("IDS_UPDATE_Get_New");
            OnlineQueryBtn.innerHTML = lg.get("Query");
			OnlineUpgradeBtn.innerHTML = lg.get("IDS_UPDATE_SEND");
			RemindNewUpgradeLab.innerHTML = lg.get("IDS_RemindNewUpgrade");
			AutoUpgradeLab.innerHTML = lg.get("IDS_MATI_AutoUpgrade");
			UpgradeRf.innerHTML = lg.get("IDS_REFRESH");
			UpgradeSave.innerHTML = lg.get("IDS_SAVE");
		}else if (a == "Alarm_Exception") {
			ab_type.innerHTML = lg.get("IDS_EVENT_TYPE");
			EX_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			EX_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			ay_start_ab_warn.innerHTML = lg.get("IDS_ENABLE");
			ay_start_Push_Switch.innerHTML = lg.get("IDS_ALARM_AppPush");
			ay_show_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			ay_start_sendEmail.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			Limit.innerHTML = lg.get("IDS_HDD_LowerLimit");
			autoReboot.innerHTML = lg.get("IDS_AUTO_REBOOT");		
			ABRf.innerHTML = lg.get("IDS_REFRESH");
			ABSave.innerHTML = lg.get("IDS_SAVE");
			label_for_CheckDiskInterval_Switch.innerHTML = lg.get("IDS_EVENT_CHECKDISKINTERVAL");
			CheckDiskIntervalSec.innerHTML = lg.get("IDS_SEC");
		}else if (a == "Alarm_PID"){
			PZ_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			PZ_Period.innerHTML = lg.get("IDS_SETTING");
			pid_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			PZEventLatchL.innerHTML = lg.get("IDS_ALARM_EVENT_LATCH");
			PZAOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			PZAODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			PZrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			PZtour_channel.innerHTML = lg.get("IDS_ALARM_TOUR");
			PZsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");	
			PZRecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
			PZ_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			PZ_PTZSet.innerHTML = lg.get("IDS_SETTING");
			PZshow_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			PZsendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			PZVoiceL.innerHTML = lg.get("IDS_ALARM_SOUND");
			PZPhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			PZFTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			PZWriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			pid_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			PZ_SV.innerHTML = lg.get("IDS_SAVE");
			PZ_Cancel.innerHTML = lg.get("IDS_CANCEL");
			PZLatchSec.innerHTML = lg.get("IDS_SEC") + " (0-600)";
			PZAOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			PZRecordSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			PZRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			PZTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			PZSnapL.innerHTML=lg.get("IDS_ALARM_SNAP_CHANNEL");
		}else if(a == "period_page"){
			WeekL.innerHTML = lg.get("IDS_WD");
			period_Title.innerHTML = lg.get("IDS_TIMESECTION");
			Period_OK.innerHTML = lg.get("IDS_OK");
			Period_cancle.innerHTML = lg.get("IDS_CANCEL");
		}else if(a == "ptz_page"){
			PTZ_Title.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			PTZ_Ok.innerHTML = lg.get("IDS_OK");
			PTZ_cancle.innerHTML = lg.get("IDS_CANCEL");
		}else if(a == "System_General"){
			TimeZone2.innerHTML = lg.get("IDS_GEN_TZ");
			TimeZone.innerHTML = lg.get("IDS_GEN_TZ");
			SystemTime.innerHTML = lg.get("IDS_GEN_SystemTime");
			DataFormat.innerHTML = lg.get("IDS_GEN_DataFormat");
			DstLable.innerHTML = lg.get("IDS_GEN_Dst");
			DstSetting.innerHTML = lg.get("IDS_GEN_DstSetting");
			DateSeparator.innerHTML = lg.get("IDS_GEN_DateSeparator");
			TimeFormat.innerHTML = lg.get("IDS_GEN_TimeFormat");
			Lang.innerHTML = lg.get("IDS_GEN_Lang");
			HddFull.innerHTML = lg.get("IDS_GEN_HddFull");
			RemoteAddr.innerHTML = lg.get("IDS_GEN_DevNo");
			VideoMode.innerHTML = lg.get("IDS_GEN_VideoFormat");
			StandByTime.innerHTML = lg.get("IDS_GEN_StandByTime");
			MinuteLab.innerHTML = lg.get("IDS_GEN_Minute");
			BtnRefresh.innerHTML = lg.get("IDS_REFRESH");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			MachineName.innerHTML = lg.get("IDS_GEN_MachineName");
		}else if(a == "System_Encode"){
			MainStream.innerHTML = lg.get("IDS_FULL_MAINSTREAM");
			SubStream.innerHTML = lg.get("IDS_FULL_SUBSTREAM");
			cbm_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			codetypeL.innerHTML = lg.get("IDS_CODE_TYPE");
			f_b_l.innerHTML = lg.get("IDS_RESOLUTION");		
			frame_ratio.innerHTML = lg.get("IDS_FRAMERATE");
			bitrate_ctrl.innerHTML = lg.get("IDS_BITRATE_CTRL");
			QualityL.innerHTML = lg.get("IDS_VIDEO_QUALITY");
			BitRateL.innerHTML = lg.get("IDS_BITERATE");
			GOPL.innerHTML = lg.get("IDS_ENC_GOP");
			VAL.innerHTML = lg.get("IDS_VIDEOAUDIO");
			SmartL.innerHTML = lg.get("IDS_ENC_SMART");
			StaticEncodeL.innerHTML = lg.get("IDS_ENC_STATICENCODE");
			AudioModeL.innerHTML = lg.get("IDS_ENC_AUDIOMODE");
			EncodeCP.innerHTML = lg.get("IDS_Copy");
			EncodePaste.innerHTML = lg.get("IDS_PASTE");
			EncodeRF.innerHTML = lg.get("IDS_REFRESH");
			EncodeSV.innerHTML = lg.get("IDS_SAVE");
			RemotePreviewL.innerHTML = lg.get("IDS_AUTH_RemotePreview");
			RemotePreview.innerHTML = lg.get("IDS_SETTING");
			EncodeDefault.innerHTML = lg.get("IDS_Default");
		}else if(a == "System_CameraParam"){
			cam_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			exposure.innerHTML = lg.get("IDS_CAM_Exposure");
			label_min.innerHTML = lg.get("IDS_CAM_LeastTime");
			label_max.innerHTML = lg.get("IDS_CAM_MostTime");
			Cam_DNMode_L.innerHTML = lg.get("IDS_CAM_DayNight");
			GearCtrl.innerHTML = lg.get("IDS_CAM_SmarLinkageRegulator");
			GearCtrl2.innerHTML = lg.get("IDS_CAM_SmarLinkageRegulator");
			DayTimeSectionL.innerHTML = lg.get("IDS_CAM_DayTimeSection");
			DayNightSwitchL.innerHTML = lg.get("IDS_CAM_DayNightSwitch");
			Cam_IrisL.innerHTML = lg.get("IDS_CAM_AutoIris");
			WhiteBalance.innerHTML = lg.get("IDS_CAM_Balance");
			Cam_AE_L.innerHTML = lg.get("IDS_CAM_AE");
			AE_DefaultL.innerHTML = lg.get("IDS_CAM_Default");
			ImageStyle.innerHTML = lg.get("IDS_CAM_ImgStyle");
			Cam_BLC_R.innerHTML = lg.get("IDS_CAM_BackLight");
			Digital_dynamic.innerHTML = lg.get("IDS_CAM_WidthDynamic");
			wide_value.innerHTML = lg.get("IDS_CAM_Most");
			Cam_Sen_L.innerHTML = lg.get("IDS_CAM_Sensitivity");
			Defog_Mode.innerHTML = lg.get("IDS_CAM_ClearFog");
			level_value.innerHTML = lg.get("IDS_CAM_Level");
			Auto_Gain.innerHTML = lg.get("IDS_CAM_AutoGain");
			Gain_value.innerHTML = lg.get("IDS_CAM_Most");
			Slow_shutterL.innerHTML = lg.get("IDS_CAM_EsShutter");
			IR_CUTL.innerHTML = lg.get("IDS_CAM_IRCUT");
			Day_Noise_Level.innerHTML = lg.get("IDS_CAM_DayNTLevel");
			Night_Noise_Level.innerHTML = lg.get("IDS_CAM_NightNTLevel");
			DebugInfo.innerHTML = lg.get("IDS_CAM_BugInformation");
			SendBtn.innerHTML = lg.get("IDS_CAM_Send");
			SaveBtn.innerHTML = lg.get("IDS_CAM_Save");
			SpecialNight.innerHTML = lg.get("IDS_CAM_SpecialNight");
			MirrorMode.innerHTML = lg.get("IDS_CAM_Mirror");
			FlipMode.innerHTML = lg.get("IDS_CAM_Roll");
			AntiMode.innerHTML = lg.get("IDS_CAM_RejectFlicker");
			IrSwapMode.innerHTML = lg.get("IDS_CAM_IRSWAP");
			PreOverExposureMode.innerHTML = WebCms.web.bHLCEnable?"HLC":lg.get("IDS_CAM_NoRedFaceExposure");
			ChncamRf.innerHTML = lg.get("IDS_REFRESH");
			ChncamSV.innerHTML = lg.get("IDS_SAVE");
			CorridorModeL.innerHTML = lg.get("IDS_MODE");
			LightUpTimeSecsionL.innerHTML = lg.get("IDS_CAM_WhiteLightUpTimeSection");
		}else if(a == "System_CameraParam_Simp"){
			Cam_DNMode_L.innerHTML = lg.get("IDS_CAM_DayNight");
			GearCtrl.innerHTML = lg.get("IDS_CAM_SmarLinkageRegulator");
			Cam_BLC_R.innerHTML = lg.get("IDS_CAM_BackLight");
			Digital_dynamic.innerHTML = lg.get("IDS_CAM_WidthDynamic");
			wide_value.innerHTML = lg.get("IDS_CAM_Most");
			Auto_Gain.innerHTML = lg.get("IDS_CAM_AutoGain");
			Gain_value.innerHTML = lg.get("IDS_CAM_Most");
			Day_Noise_Level.innerHTML = lg.get("IDS_CAM_DayNTLevel");
			Night_Noise_Level.innerHTML = lg.get("IDS_CAM_NightNTLevel");
			MirrorMode.innerHTML = lg.get("IDS_CAM_Mirror");
			FlipMode.innerHTML = lg.get("IDS_CAM_Roll");
			AntiMode.innerHTML = lg.get("IDS_CAM_RejectFlicker");
			IrSwapMode.innerHTML = lg.get("IDS_CAM_IRSWAP");
			PreOverExposureMode.innerHTML = WebCms.web.bHLCEnable?"HLC":lg.get("IDS_CAM_NoRedFaceExposure");
			ChncamRf.innerHTML = lg.get("IDS_REFRESH");
			ChncamSV.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "System_ColorParam"){
			channels_num_1.innerHTML = lg.get("IDS_CHANNEL");
			TimeSectionL.innerHTML = lg.get("IDS_PERIOD");
			BrightnessL.innerHTML = lg.get("IDS_SYSTEM_BRIGHTNESS");
			ContrastL.innerHTML = lg.get("IDS_SYSTEM_CONTRAST");
			SaturationL.innerHTML = lg.get("IDS_SYSTEM_SATURATION");
			HueL.innerHTML = lg.get("IDS_SYSTEM_HUE");
			GainL.innerHTML = lg.get("IDS_SYSTEM_GAIN");
			HorizontalL.innerHTML = lg.get("IDS_SYSTEM_HORIZONTALACUTANCE");
			VerticalL.innerHTML = lg.get("IDS_SYSTEM_VERTICALACUTANCE");

			Mirror_lg.innerHTML = lg.get("IDS_CAM_Mirror");
			Roll_lg.innerHTML = lg.get("IDS_CAM_Roll");
			ColorSetdefault.innerHTML = lg.get("IDS_DEF");
			ColorSet_Ok.innerHTML = lg.get("IDS_OK");
			ColorSet_Refresh.innerHTML = lg.get("IDS_REFRESH");
			
			InfraredLamp_Close.innerHTML = lg.get("IDS_IMG_IRCUTCLOSE");
			InfraredLamp_Open.innerHTML = lg.get("IDS_IMG_IRCUTOPEN");
			ColdColorSet.innerHTML = lg.get("IDS_ColdColor");
			WarmColorSet.innerHTML = lg.get("IDS_WarmColor");
			DftColorSet.innerHTML = lg.get("IDS_DftColor");
			CopySet.innerHTML = lg.get("IDS_Copy");
			colorOk.innerHTML = lg.get("IDS_Copy");
			colorSelectedAll.innerHTML = lg.get("IDS_DEF_AllDefault");
			colorSelectCopy.innerHTML = lg.get("IDS_SEL_CHID");			
		}else if(a == "System_ROI"){
			roiEnableTip.innerHTML = lg.get("IDS_ENABLE");
			roiLevelTip.innerHTML =lg.get("ROI Level");
			roiRefresh.innerHTML = lg.get("IDS_REFRESH");
			roiSave.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "IPCParam_Version"){
			IPC_Channel.innerHTML = lg.get("IDS_CHANNEL");
			IPC_Name.innerHTML = lg.get("IDS_DISP_ChannelName");
			IPC_IP.innerHTML = lg.get("IDS_NET_IPADDR");
			IPC_System.innerHTML = lg.get("IDS_VER_System");
			IPC_Build_Date.innerHTML = lg.get("IDS_VER_BuildData");
			IPC_Serial_ID.innerHTML = lg.get("IDS_VER_SerialID");
			IPCVersionRf.innerHTML = lg.get("IDS_REFRESH");
			IPCVersionSave.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "IPCParam_ImageSet"){
			ImageChidL.innerHTML = lg.get("IDS_CHANNEL");
			IPC_TimeSectionL.innerHTML = lg.get("IDS_PERIOD");
			IPC_BrightnessL.innerHTML = lg.get("IDS_SYSTEM_BRIGHTNESS");
			IPC_ContrastL.innerHTML = lg.get("IDS_SYSTEM_CONTRAST");
			IPC_SaturationL.innerHTML = lg.get("IDS_SYSTEM_SATURATION");
			IPC_HueL.innerHTML = lg.get("IDS_SYSTEM_HUE");
			IPC_GainL.innerHTML = lg.get("IDS_SYSTEM_GAIN");
			IPC_HorizontalL.innerHTML = lg.get("IDS_SYSTEM_HORIZONTALACUTANCE");
			IPC_VerticalL.innerHTML = lg.get("IDS_SYSTEM_VERTICALACUTANCE");
			IPC_Mirror_lg.innerHTML = lg.get("IDS_CAM_Mirroring");
			IPC_Flip_lg.innerHTML = lg.get("IDS_CAM_Overturn");
			IPC_CorridorMode_lg.innerHTML = lg.get("IDS_CAM_CorridorMode");
			IPC_IrSwap_lg.innerHTML = lg.get("IDS_CAM_IRSWAP");
			ImageSetdefault.innerHTML = lg.get("IDS_DEF");
			ImageSet_Ok.innerHTML = lg.get("IDS_OK");
			ImageSet_Rf.innerHTML = lg.get("IDS_REFRESH");     
			IPC_InfraredLamp_Close.innerHTML = lg.get("IDS_IMG_IRCUTCLOSE");
			IPC_InfraredLamp_Open.innerHTML = lg.get("IDS_IMG_IRCUTOPEN");
			IPC_DNMode_L.innerHTML = lg.get("IDS_CAM_DayNight");
			IPC_GearCtrl.innerHTML = lg.get("IDS_CAM_SmarLinkageRegulator");
			IPC_WhiteBalance.innerHTML = lg.get("IDS_CAM_Balance");
			IPC_ImageStyle.innerHTML = lg.get("IDS_CAM_ImgStyle");
			IPC_DwdrModeL.innerHTML = lg.get("IDS_CAM_WidthDynamic");
			ipc_wide_value.innerHTML = lg.get("IDS_CAM_Most");
			IPC_DayNightSwitchL.innerHTML = lg.get("IDS_CAM_DayNightSwitch");
			IPC_GearCtrl2.innerHTML = lg.get("IDS_CAM_SmarLinkageRegulator");
			IPC_KeepDayPeriodL.innerHTML = lg.get("IDS_CAM_DayTimeSection");
			IPC_WhiteLightUpL.innerHTML = lg.get("IDS_CAM_WhiteLightUpTimeSection");
		}else if(a == "IPCParam_LightSet"){
			LightSetChidL.innerHTML = lg.get("IDS_CHANNEL");
			LightSetSv.innerHTML = lg.get("IDS_SAVE");
			LightSetRf.innerHTML = lg.get("IDS_REFRESH");
			DurationSec.innerHTML = lg.get("IDS_SEC");
			LightDNMode_L.innerHTML = lg.get("IDS_CAM_DayNight");
			LightLevelL.innerHTML = lg.get("IDS_SSV");
			WorkModeL.innerHTML = lg.get("IDS_CAM_WorkMode");
			DurationL.innerHTML = lg.get("IDS_CAM_LightingTime");
			PeriodStartL.innerHTML = lg.get("IDS_LOG_BEGINTIME");
			PeriodEndL.innerHTML = lg.get("IDS_LOG_ENDTIME");
			StartHourL.innerHTML = lg.get("IDS_HOUR");
			StartMinuteL.innerHTML = lg.get("IDS_GEN_Minute");
			EndHourL.innerHTML = lg.get("IDS_HOUR");
			EndMinuteL.innerHTML = lg.get("IDS_GEN_Minute");
		}else if(a == "IPCParam_Advanced"){
			ipc_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			IPCexposureL.innerHTML = lg.get("IDS_CAM_Exposure");
			ipc_label_min.innerHTML = lg.get("IDS_CAM_LeastTime");
			ipc_label_max.innerHTML = lg.get("IDS_CAM_MostTime");
			IPC_Cam_IrisL.innerHTML = lg.get("IDS_CAM_AutoIris");
			IPC_Cam_AE_L.innerHTML = lg.get("IDS_CAM_AE");
			IPC_AE_DefaultL.innerHTML = lg.get("IDS_CAM_Default");
			IPC_Cam_BLCL.innerHTML = lg.get("IDS_CAM_BackLight");
			IPC_Cam_SenL.innerHTML = lg.get("IDS_CAM_Sensitivity");
			IPC_Defog_Mode.innerHTML = lg.get("IDS_CAM_ClearFog");
			ipc_level_value.innerHTML = lg.get("IDS_CAM_Level");
			IPC_Auto_Gain.innerHTML = lg.get("IDS_CAM_AutoGain");
			IPC_Gain_value.innerHTML = lg.get("IDS_CAM_Most");
			IPC_Slow_shutterL.innerHTML = lg.get("IDS_CAM_EsShutter");
			IPC_IR_CUTL.innerHTML = lg.get("IDS_CAM_IRCUT");
			IPCDay_Noise_Level.innerHTML = lg.get("IDS_CAM_DayNTLevel");
			IPCNight_Noise_Level.innerHTML = lg.get("IDS_CAM_NightNTLevel");
			IPC_AntiMode.innerHTML = lg.get("IDS_CAM_RejectFlicker");
			IPC_PreOverExposureMode.innerHTML = WebCms.web.bHLCEnable?"HLC":lg.get("IDS_CAM_NoRedFaceExposure");
			ChncamRf.innerHTML = lg.get("IDS_REFRESH");
			ChncamSV.innerHTML = lg.get("IDS_SAVE");
			IPC_VolumeL.innerHTML = lg.get("IDS_CAM_AudioVolume");
		}else if(a == "IPCParam_Maintain"){
			MaintainChidL.innerHTML = lg.get("IDS_CHANNEL");
			IPCMaintainRf.innerHTML = lg.get("IDS_REFRESH");
			IPCReboot.innerHTML = lg.get("IDS_ADV_REBOOT");
			IPCRestore.innerHTML = lg.get("IDS_DEF_DefaultReset");
		}else if(a == "System_Network"){
			NetCardL.innerHTML = lg.get("IDS_NETW_Netcard");
			DHCPLab.innerHTML = lg.get("IDS_NETW_DHCPEnable");
			AdaptiveLab.innerHTML = lg.get("IDS_NETW_ADAPEnable");
			NetIP.innerHTML = lg.get("IDS_NET_IPADDR");
			SubnetMask.innerHTML = lg.get("IDS_NETW_NetMask");
			Gateway.innerHTML = lg.get("IDS_NETW_Gateway");
			PrimaryDNS.innerHTML = lg.get("IDS_NETW_PrimaryDNS");
			SecondaryDNS.innerHTML = lg.get("IDS_NETW_SecondaryDNS");
			MediaPort.innerHTML = lg.get("IDS_NETW_TcpPort");
			HttpPort.innerHTML = lg.get("IDS_NETW_HttpPort");
			OnvifPort.innerHTML = lg.get("IDS_NETW_OnvifPort");
			DeviceInfoL.innerHTML = lg.get("IDS_NETW_MAC");
			OnvifCheckLab.innerHTML = lg.get("IDS_NETW_OnvifProtect");
			HSDLab.innerHTML = lg.get("IDS_NETW_HSDownload");
			TransferPolicy.innerHTML = lg.get("IDS_NETW_TransferPolicy");
			NetworkEncryption.innerHTML = lg.get("IDS_NETW_NetworkEncryption");
			NetworkRf.innerHTML = lg.get("IDS_REFRESH");
			NETSetUp.innerHTML = lg.get("IDS_NETW_Setup");
			NetworkSave.innerHTML = lg.get("IDS_SAVE");
			NT_Netcard.innerHTML = lg.get("IDS_NETW_NetworkCard");
			NT_IPAddress.innerHTML = lg.get("IDS_NET_IPADDR");
			NT_NetMode.innerHTML = lg.get("IDS_NETW_NetworkMode");
			NT_Compose.innerHTML = lg.get("IDS_NETW_NetcardCompose");
			NT_EditAndUnbind.innerHTML = lg.get("IDS_NETW_EditAndUnbind");
			NT_IpAddressL.innerHTML = lg.get("IDS_NET_IPADDR") + ":";
			NT_GateWayL.innerHTML = lg.get("IDS_NETW_Gateway") + ":";
			NT_NetModeL.innerHTML = lg.get("IDS_MODE") + ":";
			NT_MacL.innerHTML = "MAC:";
			NT_SubMaskL.innerHTML = lg.get("IDS_NETW_NetMask") + ":";
			DefaultNetcardL.innerHTML = lg.get("IDS_NETW_DefaultNetcard");
			LabelPhysBandwidths.innerHTML = lg.get("Bandwidths");
		}else if(a == "System_NetService"){
			Head_ServiceName.innerHTML = lg.get("IDS_NETS_Name");
		}else if (a == "NetService_Email") {
			email_enable.innerHTML = lg.get("IDS_EMAIL_ENABLE");
			encrypt_type.innerHTML = lg.get("IDS_EMAIL_ENCRYPTION");
			SMTP_port.innerHTML = lg.get("IDS_EMAIL_PORT");
			SMTP_server.innerHTML = lg.get("IDS_EMAIL_SERVER");
			email_username.innerHTML = lg.get("IDS_USERNAME");
			email_passwd.innerHTML = lg.get("IDS_PSW");
			email_sender.innerHTML = lg.get("IDS_EMAIL_SENDADDRESS");
			email_recv.innerHTML = lg.get("IDS_EMAIL_RECEVICE");
			email_title.innerHTML = lg.get("IDS_EMAIL_TITLE");
			EmailRf.innerHTML = lg.get("IDS_REFRESH");
			EmailSV.innerHTML = lg.get("IDS_SAVE");
			EmailTest.innerHTML = lg.get("IDS_EMAILTEST");
			EmailTestStop.innerHTML = lg.get("IDS_EMAILSTOP");
		}else if (a == "NetService_DDNS") {
			nd_type.innerHTML = lg.get("IDS_DDNS_TYPE");
			nd_enable.innerHTML = lg.get("IDS_DDNS_ENABLE");
			nd_hostname.innerHTML = lg.get("IDS_DDNS_DOMAINNAME");
			nd_usename.innerHTML = lg.get("IDS_USERNAME");
			nd_passwd.innerHTML = lg.get("IDS_PSW");
			DDNSSave.innerHTML = lg.get("IDS_SAVE");
			DDNSRf.innerHTML = lg.get("IDS_REFRESH");
			DDNSTest.innerHTML = lg.get("IDS_DDNSTEST");
		}else if (a == "NetService_IPFilter") {
			Head_Address.innerHTML = lg.get("IDS_NET_IPADDR");
			IPFilterlist_enable_text.innerHTML = lg.get("IDS_IPLIST_ENABLE");
			IPFilterlist_Restricted_text.innerHTML = lg.get("IDS_IPLIST_RESTRICTED");
			IPFilterlist_StartAddr.innerHTML = lg.get("IDS_NET_IPADDR");
			IPFilterlist_SingleAdd.innerHTML = lg.get("IDS_IPLIST_Add");
			IPFilterlist_Del.innerHTML = lg.get("IDS_IPLIST_DELETE");
			IPFilterlist_Save.innerHTML = lg.get("IDS_SAVE");
			IPFilterlist_Rf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_NTP"){
			Enable.innerHTML = lg.get("IDS_NTP_Enable");
			CustomTxt.innerHTML = lg.get("IDS_NTP_Custom");
			AutoTxt.innerHTML = lg.get("IDS_NTP_AutoSelectServer");
			NetIP.innerHTML = lg.get("IDS_NTP_ServerName");
			NetPort.innerHTML = lg.get("IDS_NTP_Port");
			UpdatePeriod.innerHTML = lg.get("IDS_NTP_UpdateInterval");
			UpdatePeriodUnit.innerHTML = lg.get("IDS_ARSP_Unit");
			NtpBtnSave.innerHTML = lg.get("IDS_SAVE");
			NtpBtnRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_UPNP"){
			Upnp_enable.innerHTML = lg.get("IDS_UPNP_Enable");
			HTTPPortL.innerHTML = lg.get("IDS_UPNP_HttpPort");
			TCPPortL.innerHTML = lg.get("IDS_UPNP_TcpPort");
			PhonePortL.innerHTML = lg.get("IDS_UPNP_MobilePort");
			UpnpRf.innerHTML = lg.get("IDS_REFRESH");
			UpnpSV.innerHTML = lg.get("IDS_SAVE");
			Notes.innerHTML = lg.get("IDS_UPNP_NOTES");
			Notes_Desc.innerHTML = lg.get("IDS_UPNP_Tip");
		}else if(a == "NetService_ARSP"){
			DDNSType.innerHTML = lg.get("IDS_ARSP_DDNSType");
			Enable.innerHTML = lg.get("IDS_ARSP_Enable");
			ServerName.innerHTML = lg.get("IDS_ARSP_ServerIP");
			Port.innerHTML = lg.get("IDS_ARSP_Port");
			UpdatePeriod.innerHTML = lg.get("IDS_ARSP_UpdatePeriod");
			Unit.innerHTML = lg.get("IDS_ARSP_Unit");
			ARSP_UserName.innerHTML = lg.get("IDS_USERNAME");
			Password.innerHTML = lg.get("IDS_PSW");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_RTMP"){
			RTMP_enable.innerHTML = lg.get("IDS_ARSP_Enable");
			ServerAddressL.innerHTML = lg.get("IDS_ARSP_ServerIP");
            rtmpStreamTypeTip.innerHTML = lg.get("IDS_PBK_Stream");
			RTMPSV.innerHTML = lg.get("IDS_SAVE");
			RTMPRf.innerHTML = lg.get("IDS_REFRESH");
		}else if (a == "NetService_FTP") {
			FTP_Startup.innerHTML = lg.get("IDS_FTP_Enable");
			FtpIpAddr.innerHTML = lg.get("IDS_FTP_ServerName");
			FtpPort.innerHTML = lg.get("IDS_FTP_Port");
			FtpLoginName.innerHTML = lg.get("IDS_USERNAME");
			FtpLoginPwd.innerHTML = lg.get("IDS_PSW");
			FtpFileLength.innerHTML = lg.get("IDS_FTP_FileLength");
			FileUnit.innerHTML = lg.get("IDS_FTP_FileUnit");
			FtpDirName.innerHTML = lg.get("IDS_FTP_DirName");
			FtpAnonymity.innerHTML = lg.get("IDS_FTP_Anonymous");
			FTPRf.innerHTML = lg.get("IDS_REFRESH");
			FTPSV.innerHTML = lg.get("IDS_SAVE");
			FtpTest.innerHTML = lg.get("IDS_FTP_Test");
			FtpPortTip.innerHTML=lg.get("IDS_FTP_PORT_TIP")
		}else if(a == "NetService_AlarmCenter"){
			Protocol_Type.innerHTML=lg.get("IDS_ALACEN_ProtocolType");
			Center_Enable.innerHTML=lg.get("IDS_ALACEN_Enable");
			IpAddr.innerHTML=lg.get("IDS_ALACEN_ServerName");
			Port.innerHTML=lg.get("IDS_ALACEN_Port");
			AlarmReportL.innerHTML=lg.get("IDS_ALACEN_AlarmReport");
			LogReportL.innerHTML=lg.get("IDS_ALACEN_LogReport");
			HeartBeatEnableL.innerHTML=lg.get("IDS_ALACEN_HeatBeatUpload");
			HeartBeatPeriodL.innerHTML=lg.get("IDS_ALACEN_HeatBeatPeriod");
			HeadtBeatPeriodTips.innerHTML=lg.get("IDS_SEC") + " (3-7200)";
			CenterRf.innerHTML=lg.get("IDS_REFRESH");
			CenterSV.innerHTML=lg.get("IDS_SAVE");
		}else if(a == "NetService_PPPoE"){
			PPPOE_Enable.innerHTML = lg.get("IDS_PPPoE_Enable");
			PPPOE_NameL.innerHTML = lg.get("IDS_USERNAME");
			PPPOE_PWL.innerHTML = lg.get("IDS_PSW");
			PPPOE_IPAddrL.innerHTML = lg.get("IDS_NET_IPADDR");
			PPPOERf.innerHTML = lg.get("IDS_REFRESH");
			PPPOESV.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "NetService_3G"){
			Net3G_EnableL.innerHTML = lg.get("IDS_3G_Enable");
			NetTypeL.innerHTML = lg.get("IDS_3G_Type");
			APNL.innerHTML=lg.get("IDS_3G_AP");
			DialNumL.innerHTML = lg.get("IDS_3G_DialNumber");
			Net3G_NameL.innerHTML = lg.get("IDS_USERNAME");
			Net3G_PWL.innerHTML = lg.get("IDS_PSW");
			Net3G_IPAddrL.innerHTML = lg.get("IDS_NET_IPADDR");
			Net3GRf.innerHTML = lg.get("IDS_REFRESH");
			Net3GSV.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "NetService_Wifi"){
			Enable.innerHTML = lg.get("IDS_WIFI_Enable");
			NetDHCP.innerHTML = lg.get("IDS_WIFI_DHCP");
			SSID.innerHTML = lg.get("IDS_WIFI_SSID");
			EncrypType.innerHTML = lg.get("IDS_WIFI_Encryption");
			KeyType.innerHTML = lg.get("IDS_WIFI_KeyType");
			Password.innerHTML = lg.get("IDS_PSW");
			IpAddress.innerHTML = lg.get("IDS_NET_IPADDR");
			SubnetMask.innerHTML = lg.get("IDS_WIFI_SubnetMask");
			Gateway.innerHTML = lg.get("IDS_WIFI_Gateway");
			BtnSreach.innerHTML = lg.get("IDS_WIFI_Sreach");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnRf.innerHTML = lg.get("IDS_REFRESH");
			Head_SSID.innerHTML = lg.get("IDS_WIFI_SSID");
			Head_RSSI.innerHTML = lg.get("IDS_WIFI_Singal");
			Head_Auth.innerHTML = lg.get("IDS_WIFI_Auth");
		}else if(a == "NetService_Nat"){
			Nat_EnableL.innerHTML = lg.get("IDS_NAT_Enable");
			MTUL.innerHTML = lg.get("IDS_NAT_MTU");
			ByteL.innerHTML = lg.get("IDS_NAT_BYTE");
			NatRf.innerHTML = lg.get("IDS_REFRESH");
			NatSV.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "NetService_PMS"){
			Enable.innerHTML = lg.get("IDS_ENABLE");
			ServerName.innerHTML = lg.get("IDS_PMS_ServerName");
			HostPort.innerHTML = lg.get("IDS_PMS_HostPort");
			BoxID.innerHTML = lg.get("IDS_PMS_BoxID");
			BtnClear.innerHTML = lg.get("IDS_CLEAR");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_SerialTrans"){
			Enable.innerHTML = lg.get("IDS_SERIALTRANS_Enable");
			CommFunction.innerHTML = lg.get("IDS_SERIALTRANS_CommFunction");
			ProtoType.innerHTML = lg.get("IDS_SERIALTRANS_ProtoType");
			ServerName.innerHTML = lg.get("IDS_SERIALTRANS_ServerName");
			HostPort.innerHTML = lg.get("IDS_SERIALTRANS_HostPort");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_SPVMN"){
			Enable.innerHTML = lg.get("IDS_SPVMN_Enable");
			SerNo.innerHTML = lg.get("IDS_SPVMN_SerNo");
			SerDNS.innerHTML = lg.get("IDS_SPVMN_SerDNS");
			SerIP.innerHTML = lg.get("IDS_SPVMN_SerIP");
			SerPort.innerHTML = lg.get("IDS_SPVMN_SerPort");
			DevNo.innerHTML = lg.get("IDS_SPVMN_DevNo");
			RegPasswd.innerHTML = lg.get("IDS_SPVMN_RegPasswd");
			LocalSer.innerHTML = lg.get("IDS_SPVMN_LocalSer");
			Validity.innerHTML = lg.get("IDS_SPVMN_Validity");
			Cardiac.innerHTML = lg.get("IDS_SPVMN_Cardiac");
			SipIP.innerHTML = lg.get("IDS_SPVMN_SipIP");
			SPVStreamType.innerHTML = lg.get("IDS_DIG_STREAM");
			SIPTransProtocolType.innerHTML = lg.get("IDS_SPVMN_SipTransProtocol");
			TalkTransProtocolType.innerHTML = lg.get("IDS_SPVMN_TalkTransProtocol");
			TalkAudioOutID.innerHTML = lg.get("IDS_SPVMN_AudioOutID");
			Channel.innerHTML = lg.get("IDS_SPVMN_Channel");
			ChanNo.innerHTML = lg.get("IDS_SPVMN_ChanNo");
			AlarmLev.innerHTML = lg.get("IDS_SPVMN_AlarmLev");
			Alarm.innerHTML = lg.get("IDS_ALARM_INPUT");
			AlarmNo.innerHTML = lg.get("IDS_SPVMN_AlarmNo");
			AlarmLev2.innerHTML = lg.get("IDS_SPVMN_AlarmLev");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_RTSP"){
			Enable.innerHTML = lg.get("IDS_ENABLE");
			port.innerHTML = lg.get("IDS_PORT");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_DAS"){
			Enable.innerHTML = lg.get("IDS_ENABLE");
			SerialNumber.innerHTML = lg.get("IDS_DAS_SERIALNUMBER");
			ServerName.innerHTML = lg.get("IDS_FTP_ServerName");
			ServerPort.innerHTML = lg.get("IDS_DAS_SERVERPORT");
			UserName.innerHTML = lg.get("IDS_USERNAME");
			Password.innerHTML = lg.get("IDS_PSW");
			DASSV.innerHTML = lg.get("IDS_SAVE");
			DASRf.innerHTML = lg.get("IDS_REFRESH");
		}else if(a == "NetService_Gat1400"){
			GAT_EnableL.innerHTML = lg.get("IDS_ENABLE");
			GAT_UserL.innerHTML = lg.get("IDS_GAT_USER");
			GAT_DevidL.innerHTML = lg.get("IDS_GAT_DEVID");
			GAT_PwdL.innerHTML = lg.get("IDS_GAT_PWD");
			GAT_IPL.innerHTML = lg.get("IDS_GAT_SERVERADDRESS");
			GAT_PortL.innerHTML = lg.get("IDS_GAT_PORT");
			GAT_RegL.innerHTML = lg.get("IDS_GAT_REG");
			GAT_HeartBeatL.innerHTML = lg.get("IDS_GAT_BEAT");
			GAT_MaxHeartBeatL.innerHTML = lg.get("IDS_GAT_MAXBEAT");
			GAT_Rf.innerHTML = lg.get("IDS_REFRESH");
			GAT_SV.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "System_Display"){
			ChanNameL.innerHTML = lg.get("IDS_DISP_ChannelName");
			BtnChanNameSet.innerHTML = lg.get("IDS_SETTING");
			LabTimeTitle.innerHTML = lg.get("IDS_DISP_TimeTitle");
			LabChannelTitle.innerHTML = lg.get("IDS_DISP_ChannelTitle");
			LabRecordStatus.innerHTML = lg.get("IDS_DISP_RecordStatus");
			LabAlarmStatus.innerHTML = lg.get("IDS_DISP_AlarmStatus");
			//LabResistTwitter.innerHTML = lg.get("IDS_DISP_ResistTwitter");
			LabAlarmGlint.innerHTML = lg.get("IDS_DISP_AlarmGlint");
			LaQRoceEn.innerHTML = lg.get("IDS_DISP_QRoceEn");
			LaChanWindowGrid.innerHTML = lg.get("IDS_DISP_ChannelWindowGrid");
			LaBitRateEn.innerHTML = lg.get("IDS_DISP_BitRate");
			Transparence.innerHTML = lg.get("IDS_DISP_Transparence");
			VideoRes.innerHTML = lg.get("IDS_DISP_VideoRes");
			Channel.innerHTML = lg.get("IDS_CHANNEL");
			Cover.innerHTML = lg.get("IDS_DISP_Cover");
			BtnCoverSet.innerHTML = lg.get("IDS_SETTING");
			LabTimeTitle2.innerHTML = lg.get("IDS_DISP_TimeTitle");
			LabChannelTitle2.innerHTML = lg.get("IDS_DISP_ChannelTitle");
			BtnChannelSet.innerHTML = lg.get("IDS_SETTING");
			LabOSD.innerHTML = lg.get("IDS_DISP_OSDInfo");
			OSDInfo.innerHTML = lg.get("IDS_DISP_OSDInfo");
			BtnRefresh.innerHTML = lg.get("IDS_REFRESH");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
			BtnChanOSDSet.innerHTML = lg.get("IDS_SETTING");
		}else if(a == "System_PTZ"){
			PTZTitle.innerHTML = lg.get("IDS_PTZ_Title");
			RS485Title.innerHTML = lg.get("IDS_PTZ_TitleRS");
			Chan.innerHTML = lg.get("IDS_CHANNEL");
			CtrlMode.innerHTML = lg.get("IDS_PTZ_CtrlMode");
			Protocol.innerHTML = lg.get("IDS_PTZ_Protocol");
			Addr.innerHTML = lg.get("IDS_PTZ_Address");
			Baudrate.innerHTML = lg.get("IDS_PTZ_Baudrate");
			DataBit.innerHTML = lg.get("IDS_PTZ_DataBit");
			StopBit.innerHTML = lg.get("IDS_PTZ_StopBit");
			Parity.innerHTML = lg.get("IDS_PTZ_Parity");
			BootCall.innerHTML = lg.get("IDS_PTZ_BootCall");
			BtnRefresh.innerHTML = lg.get("IDS_REFRESH");
			BtnSave.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "System_Serial"){
			CommFuncSerial.innerHTML = lg.get("IDS_SERIAL_ComFunc");
			BaudrateSerial.innerHTML = lg.get("IDS_SERIAL_Baudrate");
			DataBitSerial.innerHTML = lg.get("IDS_SERIAL_DataBit");
			StopBitSerial.innerHTML = lg.get("IDS_SERIAL_StopBit");
			ParitySerial.innerHTML = lg.get("IDS_SERIAL_Parity");
			BtnRefreshSerial.innerHTML = lg.get("IDS_REFRESH");
			BtnSaveSerial.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "Advance_HddManager"){
			HddSetReadWrite.innerHTML = lg.get("IDS_HDDM_SetReadWrite");
			HddSetSnapShot.innerHTML = lg.get("IDS_HDDM_SetSnapshot");
			HddSetReadOnly.innerHTML = lg.get("IDS_HDDM_SetReadonly");
			HddSetRedu.innerHTML = lg.get("IDS_HDDM_SetRedu");
			HddClearDisk.innerHTML = lg.get("IDS_HDDM_ClearDisk");
			HddRecoverError.innerHTML = lg.get("IDS_HDDM_RecoverError");
			HddPartition.innerHTML = lg.get("IDS_HDDM_Partition");
			HddDevAdd.innerHTML = lg.get("IDS_HDDM_DevAdd");
			HddDevDel.innerHTML = lg.get("IDS_HDDM_DevDel");
			Head_Index.innerHTML = lg.get("IDS_HDDM_Index");
			Head_Disk.innerHTML = lg.get("IDS_HDDM_Disk");
			Head_Type.innerHTML = lg.get("IDS_HDDM_Type");
			Head_Status.innerHTML = lg.get("IDS_HDDM_Status");
			Head_Capacity.innerHTML = lg.get("IDS_HDDM_Capacity");
			Head_LeftCapacity.innerHTML = lg.get("IDS_HDDM_LeftCapacity");
		}else if (a == "Advance_Account") {
			Head_UserNo.innerHTML = lg.get("IDS_ACC_UserNo");
			Head_UserName.innerHTML = lg.get("IDS_ACC_User");
			Head_Group.innerHTML = lg.get("IDS_ACC_Group");
			USUsRf.innerHTML = lg.get("IDS_REFRESH");
			modUser.innerHTML = lg.get("IDS_ACC_ModifyUser");
			modGroup.innerHTML = lg.get("IDS_ACC_ModifyGroup");
			modPwd.innerHTML = lg.get("IDS_ACC_ModifyPW");
			addUser.innerHTML = lg.get("IDS_ACC_AddUser");
			addGroup.innerHTML = lg.get("IDS_ACC_AddGroup");
			delUser.innerHTML = lg.get("IDS_ACC_DeleteUser");
			delGroup.innerHTML = lg.get("IDS_ACC_DeleteGroup");
			USSecurity.innerHTML = lg.get("IDS_ACC_Security");
			deletinfo.innerHTML = lg.get("IDS_ACC_SureToDelete");
			DelGroupListL.innerHTML = lg.get("IDS_ACC_Group");
			DelGroupNameL.innerHTML = lg.get("IDS_ACC_GroupName");
			DelMemoL.innerHTML = lg.get("IDS_ACC_Memo");
			Confirm_Del.innerHTML = lg.get("IDS_OK");
			PWDUserNameListL.innerHTML = lg.get("IDS_USERNAME");
			ModOldPWDL.innerHTML = lg.get("IDS_ACC_OldPassword");
			ModPWDL.innerHTML = lg.get("IDS_ACC_NewPassword");
			ModConPWDL.innerHTML = lg.get("IDS_ACC_Confirm");
			ModPWDBtn.innerHTML = lg.get("IDS_OK");
			UserNameListL.innerHTML = lg.get("IDS_ACC_User");
			UserNameL.innerHTML = lg.get("IDS_USERNAME")
			SharableL.innerHTML = lg.get("IDS_ACC_Reuseable");
			PWDL.innerHTML = lg.get("IDS_PSW");
			ConPWDL.innerHTML = lg.get("IDS_ACC_ConfirmPassword");
			GroupL.innerHTML = lg.get("IDS_ACC_Group");
			MemoL.innerHTML = lg.get("IDS_ACC_Memo");
			GroupNameListL.innerHTML = lg.get("IDS_ACC_Group");
			GroupNameL.innerHTML = lg.get("IDS_ACC_GroupName");
			MemoL2.innerHTML = lg.get("IDS_ACC_Memo");
			AuthorityTip.innerHTML = lg.get("IDS_ACC_Authority");
			UserAuthTab.innerHTML = lg.get("IDS_ACC_SystemManager");
			PlaybackTab.innerHTML = lg.get("IDS_ACC_Playback");
			MonitorTab.innerHTML = lg.get("IDS_ACC_Monitor");
			AddBtn.innerHTML = lg.get("IDS_OK");
			ModBtn.innerHTML = lg.get("IDS_OK");
			Account_btn_cancle.innerHTML = lg.get("IDS_CANCEL");
		}else if(a == "security"){
			security_tip1.innerHTML = lg.get("IDS_SECU_TIPS");
			pswQuestion1L.innerHTML = lg.get("IDS_QUESTION");
			pswAnswer1L.innerHTML = lg.get("IDS_ANSWER");
			pswQuestion2L.innerHTML=lg.get("IDS_QUESTION");
			pswAnswer2L.innerHTML = lg.get("IDS_ANSWER");
			AppL.innerHTML = lg.get("IDS_SECU_App");
			ContactL.innerHTML = lg.get("IDS_SECU_Contact");
			securitySMTP.innerHTML = lg.get("IDS_SECU_SMTPINFO");
			SafetyTitle.innerHTML = lg.get("IDS_SAFETY_TITLE");
			VerifyTitle.innerHTML = lg.get("IDS_VERIFY_TITLE");
			SecurityRf.innerHTML = lg.get("IDS_REFRESH");
			SecuritySV.innerHTML = lg.get("IDS_SAVE");
			SecurityExit.innerHTML = lg.get("IDS_EXIT");
			Notes.innerHTML = lg.get("IDS_UPNP_NOTES");
		}else if (a == "Advance_AutoMaintain") {
			auto_reboot.innerHTML = lg.get("IDS_MATI_AutoReboot");
			timeLimit.innerHTML = lg.get("IDS_MATI_At")
			auto_del_files.innerHTML = lg.get("IDS_MATI_DelFiles");
			AutoDelDayUnit.innerHTML = lg.get("IDS_MATI_DaysAgo");
			online_upgrade.innerHTML = lg.get("IDS_MATI_OnlineUpgrade");
			AutoUpgradeLab.innerHTML = lg.get("IDS_MATI_AutoUpgrade");
			AutoMaintainRf.innerHTML = lg.get("IDS_REFRESH");
			AutoMaintainSave.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "Advance_Default"){
			DefTitle.innerHTML = lg.get("IDS_DEF_TITLE");
			labAllDefault.innerHTML = lg.get("IDS_DEF_AllDefault");
			labGeneral.innerHTML = lg.get("IDS_DEF_General");
			labEncode.innerHTML = lg.get("IDS_DEF_Encode");
			labRecord.innerHTML = lg.get("IDS_DEF_Record");
			labAlarm.innerHTML = lg.get("IDS_DEF_Alarm");
			labNetwork.innerHTML = lg.get("IDS_DEF_Network");
			labNetServer.innerHTML = lg.get("IDS_DEF_NetServer");
			labDisplay.innerHTML = lg.get("IDS_DEF_Display");
			labAccount.innerHTML = lg.get("IDS_DEF_Account");
			labCommCfg.innerHTML = lg.get("IDS_DEF_CommConfig");
			labCamera.innerHTML = lg.get("IDS_DEF_CameraParam");
			DefaultSave.innerHTML = lg.get("IDS_SAVE");
			DefaultReset.innerHTML = lg.get("IDS_DEF_DefaultReset");
			DefaultResetPrompt.innerHTML = lg.get("IDS_DEF_DefaultResetPrompt");
			FactoryReset.innerHTML = lg.get("IDS_DEF_FactoryReset");
			FactoryResetPrompt.innerHTML = lg.get("IDS_DEF_FactoryResetPrompt");
		}else if(a == "Advance_ImportEx"){
			ImportCfg.innerHTML = lg.get("IDS_IMEX_ImportCfg");
			ExportCfg.innerHTML = lg.get("IDS_IMEX_ExportCfg");
			ExportIPCLog.innerHTML = lg.get("IDS_IMEX_ExportLog");
			ExportDevLog.innerHTML = lg.get("IDS_IMEX_ExportLog");
			ConfigImExTitle.innerHTML = lg.get(lg.get("IDS_Alarm_AUTO") + " " + lg.get("IDS_ADV_IMPORT_EXPORT"));
			DevLogExTitle.innerHTML = lg.get(lg.get("LogExport"));
		}else if(a == "Advance_Reboot"){
			RebootTitle.innerHTML = lg.get("IDS_REBOOT_Title");
			RebootBtn.innerHTML = lg.get("IDS_REBOOT_Button");
		}else if(a == "Advance_ChannelType"){
			PlayBackMaxL.innerHTML = lg.get("IDS_MODE_PBMAXSUPPORT") + " :";
			DefaultPBMaxL.innerHTML = lg.get("IDS_CAM_Default") + " :";
			PreviewMaxL.innerHTML = lg.get("IDS_MODE_PREVIEWMAXSUPPORT") + " :";
			PreviewMaxChannelL.innerHTML = lg.get("IDS_MODE_PREVIEWMAXSUPPORT") + " :";
			CustomTxt.innerHTML = lg.get("IDS_MODE_CUSTOM");
			ModeRf.innerHTML = lg.get("IDS_REFRESH");
			ModeSave.innerHTML = lg.get("IDS_SAVE");
		}else if(a == "Advance_Digital"){
			DigitalChL.innerHTML = lg.get("IDS_CHANNEL");
			Digital_Switch.innerHTML = lg.get("IDS_ENABLE");
			TimeModeL.innerHTML = lg.get("IDS_DIG_SYNC");
			ConModeL.innerHTML = lg.get("IDS_DIG_MODE");
			SynChEnL.innerHTML = lg.get("IDS_DIG_SYNCRES");
			TourTimeL.innerHTML = lg.get("IDS_DIG_TOURTIME");
			NetListTip.innerHTML = lg.get("IDS_DIG_NETCONFIGLIST");
			DecodeL.innerHTML = lg.get("IDS_DIG_DECODE");
			DigitalAdd.innerHTML = lg.get("IDS_ADD");
			DigitalDel.innerHTML = lg.get("IDS_DELETE");
			DigitalRf.innerHTML = lg.get("IDS_REFRESH");
			DigitalSave.innerHTML = lg.get("IDS_SAVE");
			Head_No.innerHTML = lg.get("IDS_DIG_No");
			Head_Name.innerHTML = lg.get("IDS_DIG_CFGNAME");
			Head_DevType.innerHTML = lg.get("IDS_DIG_DevType");
			Head_IP.innerHTML = lg.get("IDS_NET_IPADDR");
			Head_RemoteCh.innerHTML = lg.get("IDS_DIG_REMOTECHANNEL");
			DigitalCP.innerHTML = lg.get("IDS_Copy");
			DigitalPaste.innerHTML = lg.get("IDS_PASTE");
			DigitalDe.innerHTML = lg.get("IDS_Default");
		}else if(a == "Advance_Remote"){
			CfgNameL.innerHTML = lg.get("IDS_DIG_CFGNAME");
			ReDevTypeL.innerHTML = lg.get("IDS_DEVTYPE");
			ProtocolL.innerHTML = lg.get("IDS_REMOTE_PROTOCOL");
			RemoteChL.innerHTML = lg.get("IDS_REMOTE_CHANNEL");
			StreamTypeL.innerHTML = lg.get("IDS_DIG_STREAM");
			RemoteIPL.innerHTML = lg.get("IDS_NET_IPADDR");
			NetWorkSet.innerHTML = lg.get("IDS_REMOTE_NETWORK");
			RemotePortL.innerHTML = lg.get("IDS_PORT");
			RTSPMainL.innerHTML = lg.get("IDS_MAINSTREAM");
			RTSPSubL.innerHTML = lg.get("IDS_EXTSREAM");
			RemoteUserL.innerHTML = lg.get("IDS_USERNAME");
			RemotePWDL.innerHTML = lg.get("IDS_PSW");
			SearchProL.innerHTML = lg.get("IDS_REMOTE_PROTOCOL");
			RemoteSearch.innerHTML = lg.get("IDS_WIFI_Sreach");
			RemoteOK.innerHTML = lg.get("IDS_OK");
			RemoteCancel.innerHTML =lg.get("IDS_CANCEL");
			Head_No2.innerHTML = lg.get("IDS_REMOTE_No");
			Head_DevName.innerHTML = lg.get("IDS_REMOTE_DevName");
			Head_DevInfo.innerHTML = lg.get("IDS_REMOTE_DevInfo");
			Head_IP2.innerHTML = lg.get("IDS_NET_IPADDR");
			Head_Port.innerHTML = lg.get("IDS_REMOTE_Port");
			Head_SerialID.innerHTML = lg.get("IDS_VER_SerialID");
		}else if(a == "Info_HddInfo"){
			Head_StorageNo.innerHTML = lg.get("IDS_HDD_Index");
			Head_Type.innerHTML = lg.get("IDS_HDD_Type");
			Head_Capacity.innerHTML = lg.get("IDS_HDD_Capacity");
			Head_LeftCapacity.innerHTML = lg.get("IDS_HDD_LeftCapacity");
			Head_Status.innerHTML = lg.get("IDS_HDD_Status");
			Head_StorageNo2.innerHTML = lg.get("IDS_HDD_Index");
			Head_StartTime.innerHTML = lg.get("IDS_HDD_StartTime");
			Head_EndTime.innerHTML = lg.get("IDS_HDD_EndTime");
			HddClearDisk2.innerHTML = lg.get("IDS_HDDM_ClearDisk");
		}else if(a == "Info_Log") {
			log_maintype.innerHTML = lg.get("IDS_LOG_TYPE");
			log_search.innerHTML = lg.get("IDS_LOG_SEARCH");
			log_clear.innerHTML = lg.get("IDS_LOG_REMOVE");
			begin_time.innerHTML = lg.get("IDS_LOG_BEGINTIME");
			end_time.innerHTML = lg.get("IDS_LOG_ENDTIME");
			log_PrePage.innerHTML = lg.get("IDS_LOG_PREPAGE");
			log_NextPage.innerHTML = lg.get("IDS_LOG_NEXTPAGE");
			Log_No.innerHTML = lg.get("IDS_LOG_NO");
			Log_Time.innerHTML = lg.get("IDS_LOG_TIME");
			Log_Operator.innerHTML = lg.get("IDS_LOG_OPERATION");
		}else if(a == "Info_Version") {
			Version_Product_Type.innerHTML = lg.get("IDS_DEVMODEL");
			Version_Channel.innerHTML = lg.get("IDS_VER_Channel");
			Version_ExChan.innerHTML = lg.get("IDS_VER_ExChan");
			Version_AlarmIn.innerHTML = lg.get("IDS_VER_AlarmIn");
			Version_AlarmOutput.innerHTML = lg.get("IDS_VER_AlarmOutput");
			Version_System.innerHTML = lg.get("IDS_VER_System");
			Info_Version_DeviceInfo.innerHTML = lg.get("IDS_VER_DeviceInfo");
			Version_Build_Date.innerHTML = lg.get("IDS_VER_BuildData");
			Version_System_Status.innerHTML = lg.get("IDS_VER_SystemStatus");
			Version_Serial_ID.innerHTML = lg.get("IDS_VER_SerialID");
			Version_Nat_Status.innerHTML = lg.get("IDS_VER_NatStatus");
			Version_Nat_Status_Code.innerHTML = lg.get("IDS_VER_NatStatusCode");
			version_mcu_ver.innerHTML = "MCU" + lg.get("IDS_Program_Version");
			DevInfoBtn.innerHTML = lg.get("IDS_VER_DeviceInfo");
		}else if(a == "Info_ChanStatus") {
			Head_Chn.innerHTML = lg.get("IDS_CHANNEL");
			Head_MaxRes.innerHTML = lg.get("IDS_CHSTA_MAX_RES");
			Head_ThisRes.innerHTML = lg.get("IDS_CHSTA_THIS_RES");
			Head_ConnectStatus.innerHTML = lg.get("IDS_CHSTA_ConnectStatus");
		}else if(a == "Info_CustomerFlow"){
			titleText1.innerHTML = lg.get("IDS_QueryConditions");
			titleText2.innerHTML = lg.get("IDS_QueryResults");
			flow_channel_num.innerHTML = lg.get("IDS_CHANNEL");
			ReportTypeL.innerHTML = lg.get("IDS_ReportFormType");
			CountTypeL.innerHTML = lg.get("IDS_CountType");
			FlowBeginTimeL.innerHTML = lg.get("IDS_PBK_StartTime");
			btnCount.innerHTML = lg.get("IDS_Count");
			listTab.innerHTML = lg.get("IDS_List");
			histogramTab.innerHTML = lg.get("IDS_Histogram");
			lineTab.innerHTML = lg.get("IDS_LineChart");
			ClearTitleL.innerHTML = lg.get("IDS_DATA_REMOVE");
			btnClear.innerHTML = lg.get("IDS_FLOW_REMOVE");
			btnResetOSD.innerHTML = lg.get("IDS_OSD_REMOVE");
			ExportFlowBtn.innerHTML = lg.get("ConfigExport");
			CustomerFlowEnableSwitchL.innerHTML = lg.get("IDS_CF_EnableSwitch");
			CFEnableSwitchL.innerHTML = lg.get("IDS_CF_CustomerFlowEnableSwitch");
			CFIsOutsideL.innerHTML = lg.get("IDS_CF_IsOutside");
			CF_Refresh.innerHTML = lg.get("IDS_REFRESH");
			CF_Save.innerHTML = lg.get("IDS_SAVE");
		}else if(a=="Alarm_SmartAlarm"){
			if(WebCms.web.webstyle == "JFPro"){
				SA_ChannelL.innerHTML = lg.get("IDS_CHANNEL");
				SA_EnableL.innerHTML = lg.get("IDS_ENABLE");
				SA_HumanL.innerHTML = lg.get("IDS_HUMAN_DETECT");
                SA_CustomFlowL.innerHTML = lg.get("IDS_CustomerFlowCount");
				SA_IsOutsideL.innerHTML = lg.get("IDS_StatisticMode");
				SA_FaceL.innerHTML = lg.get("IDS_ALARM_FACE");
				SA_CarL.innerHTML = lg.get("CarShapeDetect");
				SA_SensitivenessL.innerHTML = lg.get("IDS_SENSITIVE");
				SA_RecordL.innerHTML = lg.get("Record");
				SA_PhoneUpL.innerHTML = lg.get("IDS_ALARM_PHONEUP");
				SA_AlarmSoundL.innerHTML = lg.get("IDS_ALARM_SOUND");
				SA_AlarmLightL.innerHTML = lg.get("IDS_ALARM_LightS");
				SA_Advance.innerHTML = lg.get("IDS_ADVANCE");
				SA_Advance_Set.innerHTML = lg.get("IDS_SETTING");
				SA_RuleAndRegionBtn.innerHTML = lg.get("IDS_SETTING");
				SA_CP.innerHTML = lg.get("IDS_Copy");
				SA_Paste.innerHTML = lg.get("IDS_PASTE");
				SA_Rf.innerHTML = lg.get("IDS_REFRESH");
				SA_Save.innerHTML = lg.get("IDS_SAVE");
				SA_Advance_Title.innerHTML=lg.get("IDS_ADVANCE");
				SA_Advance_Confirm.innerHTML=lg.get("IDS_OK");
				SA_Advance_Cancel.innerHTML=lg.get("IDS_CANCEL");
				SA_IntervalL.innerHTML=lg.get("IDS_ALARM_INTERVAL");
				SA_IntervalSec.innerHTML=lg.get("IDS_SEC") + " (0-600)";
				SA_PTZSetL.innerHTML=lg.get("IDS_PTZ_LINKAGE");
				SA_PTZSet.innerHTML=lg.get("IDS_SETTING");
				SA_RecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
				SA_RecordSec.innerHTML=lg.get("IDS_SEC") + " (10-300)";
				SA_TourL.innerHTML=lg.get("IDS_ALARM_TOUR");
				SA_SnapL.innerHTML=lg.get("Snapshot");
				SA_sendEmailL.innerHTML=lg.get("IDS_EVENT_SENDEMAIL");
				SA_FTPL.innerHTML=lg.get("IDS_ALARM_FTP");
				SA_WriteLogL.innerHTML=lg.get("IDS_ALARM_WriteLog");
				SA_alarm_toneL.innerHTML=lg.get("IDS_ALARM_TONE");
				SA_AbAlarmToneCustomButton.innerHTML=lg.get("IDS_CUSTOM");
				SA_VoiceTipL.innerHTML=lg.get("IDS_VOICE_PROMPT");
				SA_VoiceTipBtn.innerHTML=lg.get("IDS_CUSTOM");
				SA_Period.innerHTML=lg.get("IDS_SETTING");
				SA_PeriodL.innerHTML=lg.get("IDS_TIMESECTION");
				SA_AOL.innerHTML=lg.get("IDS_OUTPUT_ALARM");
				SA_AODelayL.innerHTML=lg.get("IDS_PD_LATCHTIME");
				SA_AOSec.innerHTML=lg.get("IDS_SEC") + " (10-300)";
				SA_IPC_AOL.innerHTML="IPC "+lg.get("IDS_OUTPUT_ALARM");
				SA_IPC_AODelayL.innerHTML=lg.get("IDS_PD_LATCHTIME");
				SA_IPC_AOSec.innerHTML=lg.get("IDS_SEC") + " (10-300)";
			}else{
				SA_ChannelL.innerHTML=lg.get("IDS_CHANNEL");
				SA_EnableL.innerHTML = lg.get("IDS_ENABLE");
				SA_HumanL.innerHTML = lg.get("IDS_HUMAN_DETECT");
                SA_CustomFlowL.innerHTML = lg.get("IDS_CustomerFlowCount");
				SA_IsOutsideL.innerHTML = lg.get("IDS_StatisticMode");
				SA_SensitivenessL.innerHTML = lg.get("IDS_SENSITIVE");
				SA_Record.innerHTML=lg.get("Record");
				SA_PhoneUp.innerHTML=lg.get("IDS_ALARM_PHONEUP");
				SA_IntervalL.innerHTML=lg.get("IDS_ALARM_INTERVAL");
				SA_IntervalSec.innerHTML=lg.get("IDS_SEC") + " (0-600)";
				SA_RecordDelayL.innerHTML=lg.get("IDS_ALARM_RECORD_DELAYTIME");
				SA_RecordSec.innerHTML=lg.get("IDS_SEC") + " (10-300)";
				SA_sendEmailL.innerHTML=lg.get("IDS_EVENT_SENDEMAIL");
				SA_FTPL.innerHTML=lg.get("IDS_ALARM_FTP");
				SA_WriteLogL.innerHTML=lg.get("IDS_ALARM_WriteLog");
				SA_alarm_toneL.innerHTML=lg.get("IDS_ALARM_TONE");
				SA_AbAlarmToneCustomButton.innerHTML=lg.get("IDS_CUSTOM");
				SA_VoiceTipL.innerHTML=lg.get("IDS_VOICE_PROMPT");
				SA_VoiceTipBtn.innerHTML=lg.get("IDS_CUSTOM");
				SA_CP.innerHTML=lg.get("IDS_Copy");
				SA_Paste.innerHTML=lg.get("IDS_PASTE");
				SA_Rf.innerHTML=lg.get("IDS_REFRESH");
				SA_Save.innerHTML=lg.get("IDS_SAVE");
				SA_Advance_Title.innerHTML=lg.get("IDS_ADVANCE");
				SA_Advance_Confirm.innerHTML=lg.get("IDS_OK");
				SA_Advance_Cancel.innerHTML=lg.get("IDS_CANCEL");
				if(g_productID === "G2"){
					SA_Region_Title.innerHTML=lg.get("IDS_Region");
					SA_motion_cvs.innerHTML=lg.get("IDS_NOT_SUPPORT");
					SA_SaveRegionBtn.innerHTML=lg.get("IDS_OK");
					SA_Region_Cancel.innerHTML=lg.get("IDS_CANCEL");
					SA_PeriodBtn.innerHTML=lg.get("IDS_TIMESECTION");
					SA_RuleAndRegionBtn.innerHTML = lg.get("IDS_Region");
					SA_AdvanceSetBtn.innerHTML = lg.get("IDS_ADVANCE");
					SA_FaceL.innerHTML = lg.get("IDS_ALARM_FACE");
				}else{
					SA_Advance.innerHTML=lg.get("IDS_ADVANCE");
					SA_AlarmLight.innerHTML=lg.get("IDS_ALARM_LightS");
					SA_TourL.innerHTML=lg.get("IDS_ALARM_TOUR");
					SA_PTZSetL.innerHTML=lg.get("IDS_PTZ_LINKAGE");
					SA_PTZSet.innerHTML=lg.get("IDS_SETTING");
					SA_MotionAndHuman_Advance_Set.innerHTML=lg.get("IDS_SETTING");
					SA_Face_Advance_Set.innerHTML=lg.get("IDS_SETTING");
					SA_RuleAndRegionBtn.innerHTML=lg.get("IDS_SETTING");
					SA_SnapL.innerHTML=lg.get("Snapshot");
					SA_Period.innerHTML=lg.get("IDS_SETTING");
					SA_PeriodL.innerHTML=lg.get("IDS_TIMESECTION");
					SA_AlarmSound.innerHTML=lg.get("IDS_ALARM_SOUND");
					SA_AOL.innerHTML=lg.get("IDS_OUTPUT_ALARM");
					SA_AODelayL.innerHTML=lg.get("IDS_PD_LATCHTIME");
					SA_AOSec.innerHTML=lg.get("IDS_SEC") + " (10-300)";
					SA_IPC_AOL.innerHTML="IPC "+lg.get("IDS_OUTPUT_ALARM");
					SA_IPC_AODelayL.innerHTML=lg.get("IDS_PD_LATCHTIME");
					SA_IPC_AOSec.innerHTML=lg.get("IDS_SEC") + " (10-300)";
					SA_Default.innerHTML = lg.get("IDS_Default");
				}
			}
		}else if (a == "Alarm_CarShape") {
			CS_ChannelNum.innerHTML = lg.get("IDS_CHANNEL");
			CS_EnableL.innerHTML = lg.get("IDS_ENABLE");	
			CS_PeriodL.innerHTML = lg.get("IDS_TIMESECTION");
			CS_Period.innerHTML = lg.get("IDS_SETTING");
			CS_AOL.innerHTML = lg.get("IDS_OUTPUT_ALARM");
			CS_AODelayL.innerHTML = lg.get("IDS_PD_LATCHTIME");
			CS_tour_1.innerHTML = lg.get("IDS_ALARM_TOUR");
			CS_PTZSetL.innerHTML = lg.get("IDS_PTZ_LINKAGE");
			CS_AbAlarmToneCustomButton.innerHTML = lg.get("IDS_CUSTOM");
			CS_PTZSet.innerHTML = lg.get("IDS_SETTING");
			CS_show_message.innerHTML = lg.get("IDS_EVENT_SHOWMSG");
			CS_sendEmailL.innerHTML = lg.get("IDS_EVENT_SENDEMAIL");
			CS_PhoneL.innerHTML = lg.get("IDS_ALARM_AppPush");
			CS_WriteLogL.innerHTML = lg.get("IDS_ALARM_WriteLog");
			CS_ShowTrackL.innerHTML = lg.get("IDS_CA_ShowTrace");
			CS_alarm_toneL.innerHTML = lg.get("IDS_ALARM_TONE");
			CS_VoiceTipL.innerHTML = lg.get("IDS_ALARM_TONE");
			CS_Rf.innerHTML = lg.get("IDS_REFRESH");
			CS_SV.innerHTML = lg.get("IDS_SAVE");
			CS_CP.innerHTML = lg.get("IDS_Copy");
			CS_Paste.innerHTML = lg.get("IDS_PASTE");
			CS_AOSec.innerHTML = lg.get("IDS_SEC") + " (10-300)";
			CSrecord_channel.innerHTML = lg.get("IDS_ALARM_RECORD_CHANNEL");
			CSRecordL.innerHTML=lg.get("IDS_ALARM_RECORD_CHANNEL");
			CSTourL.innerHTML = lg.get("IDS_ALARM_TOUR");
			CS_FTPL.innerHTML = lg.get("IDS_ALARM_FTP");
			CS_Default.innerHTML = lg.get("IDS_Default");
			CSsnap_channel.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");
			CSSnapL.innerHTML = lg.get("IDS_ALARM_SNAP_CHANNEL");
			CS_VoiceIntervalL.innerHTML = lg.get("IDS_VOICE_INTERVAL");
			CS_VoiceIntervalSec.innerHTML = lg.get("IDS_SEC") + " (0-3599)";
		} else if (a== "System_NetworkIPV6") {
			NetworkIPV6Save.innerHTML = lg.get("IDS_SAVE");
			LinkAddress.innerHTML = lg.get("IDS_LINK_ADDRESS");
			IPV6Address.innerHTML = lg.get("IDS_IPV6_ADDRESS");
			DefaultGateWay.innerHTML = lg.get("IDS_GETE_WAY");
			DnsTip_IPV6.innerHTML = lg.get("IDS_DNSTIP_IPV6");
			IPV6PrimaryDNSL.innerHTML = lg.get("IDS_PRIMARY_DNS");
			IPV6SecondaryDNSL.innerHTML = lg.get("IDS_SECONDARY_DNS");
			NetworkIPV6Rf.innerHTML = lg.get("IDS_REFRESH");
		}
	}
	try{
		translateLang();
	}catch(e){

	}
};
function getLanguageCode(language){
	var nLang = -1;
	if(language == "English"){
		nLang = 0;
	}else if(language == "SimpChinese"){
		nLang = 1;
	}else if(language == "TradChinese"){
		nLang = 2;
	}else if(language == "Italian"){
		nLang = 3;
	}else if(language == "Spanish"){
		nLang = 4;
	}else if(language == "Japanese"){
		nLang = 5;
	}else if(language == "Russian"){
		nLang = 6;
	}else if(language == "French"){
		nLang = 7;
	}else if(language == "German"){
		nLang = 8;
	}else if(language == "Portugal"){
		nLang = 9;
	}else if(language == "Turkey"){
		nLang = 10;
	}else if(language == "Poland"){
		nLang = 11;
	}else if(language == "Romanian"){
		nLang = 12;
	}else if(language == "Hungarian"){
		nLang = 13;
	}else if(language == "Finnish"){
		nLang = 14;
	}else if(language == "Estonian"){
		nLang = 15;
	}else if(language == "Korean"){
		nLang = 16;
	}else if(language == "Farsi"){
		nLang = 17;
	}else if(language == "Dansk"){
		nLang = 18;
	}else if(language == "Thai"){
		nLang = 19;
	}else if(language == "Greek"){
		nLang = 20;
	}else if(language == "Vietnamese"){
		nLang = 21;
	}else if(language == "Ukrainian"){
		nLang = 22;
	}else if(language == "Brazilian"){
		nLang = 23;
	}else if(language == "Hebrew"){
		nLang = 24;
	}else if(language == "Indonesian"){
		nLang = 25;
	}else if(language == "Arabic"){
		nLang = 26;
	}else if(language == "Swedish"){
		nLang = 27;
	}else if(language == "Czech"){
		nLang = 28;
	}else if(language == "Bulgarian"){
		nLang = 29;
	}else if(language == "Slovakia"){
		nLang = 30;
	}else if(language == "Dutch"){
		nLang = 31;
	}else if(language == "Serbian"){
		nLang = 32;
	}else if(language == "Croatian"){
		nLang = 33;
	}else if(language == "Azerbaycan"){
		nLang = 34;
	}else if(language == "ChineseEnglish"){
		nLang = 35;
	}else{
		nLang = 0;
	}
	return nLang;
}
function getCodeErrorString(a){
	if(a == 102){
		return lg.get("IDS_INFO_NO_SUPPORT");
	}else if(a == 103){
		return lg.get("IDS_INVALID_REQ");
	}else if(a == 105){
		return lg.get("IDS_NO_LOGIN");
	}else if(a == 106 || a == 203){
		return lg.get("IDS_PSWERROR");
	}else if(a == 107){
		return lg.get("IDS_NO_POWER");
	}else if(a == 109){
		return lg.get("IDS_NO_FINDFILE");
	}else if(a == 117){
		return lg.get("IDS_JSON_ERROR");
	}else if(a == 124){
		return lg.get("IDS_ENCRYPT_ERROR");
	}else if(a == 136){
		return lg.get("IDS_CGI_ERROR_FORMAT");
	}else if(a == 207){
		return lg.get("IDS_IPBANNED");
	}else if(a == 206){
		return lg.get("IDS_NAME_BLOCKED");
	}else if(a ==208){
		return lg.get("IDS_USER_MULTIPLEXING");
	}else if(a == 609){
		return lg.get("IDS_CONFIG_NOT_EXIST");
	}else if(a == -2){
		return lg.get("IDS_RECEIVE_TIMEOUT");
	}else if(a == WEB_ERROR.ERR_ALARM_RECV_NO_START){
		return lg.get("IDS_START_ALARM_FAIL");
	}else if(a == WEB_ERROR.ERR_BINDBROWSEFAIL){
		return lg.get("IDS_BIND_BROWSE_FAIL");
	}else if(a == WEB_ERROR.ERR_FAIL_CONNECT_PLAYER){
		return lg.get("IDS_CONNECT_PLAYER_FAIL");
	}else if(a == WEB_ERROR.ERR_NOFINDDEVICE){
		return lg.get("IDS_NO_FIND_DEVICE");
	}else if(a == WEB_ERROR.ERR_TIMEOUT){
		return lg.get("IDS_TIMEOUT");
	}else if(a ==WEB_ERROR.ERR_DISABLE_INLINE_UPGRADE){
		return lg.get("IDS_DISABLE_ONLINE_UPGRADE");
	}else if(a ==WEB_ERROR.ERR_DEV_INFO_ABNORMAL){
		return lg.get("IDS_DEV_INFO_ABNORMAL");
	}else if(a ==WEB_ERROR.ERR_OTHER_CLIENT_UPGRADING){
		return lg.get("IDS_OTHER_CLIENT_UPGRADING");
	}else if(a == WEB_ERROR.ERR_WebServerNoRun){
		return lg.get("Local web service not started");
	}else{
		return lg.get("IDS_UNKNOWN_ERR");
	}
}
