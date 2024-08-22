'use client';
import { Button } from '@/components/Button';
import InputBox from '@/components/InputBox';
import { SERVER_URL } from '@/lib/Constants';
import Link from 'next/link';
import React, { useState } from 'react';
import {
	formatISOForTimeZone,
	formatDateForTimeZone,
	formatTimeForTimeZone,
} from '@/lib/Timezone';
import TimezoneDropdown from '../../components/TimeZoneDropDown';
import Tooltip from '@/components/Tooltip';

type FormInputs = {
	name: string;
	email: string;
	password: string;
	timeZone: string;
	role: string;
	scheduledStart: string;
	scheduledEnd: string;
};

type TimeZoneData = {
	date: string;
	time: string;
	iso: string;
};

type FormattedDateTime = {
	[key: string]: TimeZoneData;
};

const timezones = [
	{ name: 'UTC', zone: 'UTC' },
	{ name: 'Asia/Manila', zone: 'Asia/Manila' },
	{ name: 'America/New_York', zone: 'America/New_York' },
	{ name: 'America/Tegucigalpa', zone: 'America/Tegucigalpa' },
];

const SignupPage = () => {
	const [formData, setFormData] = useState<FormInputs>({
		name: '',
		email: '',
		password: '',
		timeZone: 'Asia/Manila',
		role: 'USER',
		scheduledStart: '',
		scheduledEnd: '',
	});

	const [selectedTimeZone, setSelectedTimeZone] = useState<string>('UTC');
	const [dateTimeInput, setDateTimeInput] = useState<string>('');
	const [formattedDateTime, setFormattedDateTime] = useState<{
		[key: string]: {
			start: TimeZoneData;
			end: TimeZoneData;
		};
	}>({
		UTC: {
			start: { date: '', time: '', iso: '' },
			end: { date: '', time: '', iso: '' },
		},
		'Asia/Manila': {
			start: { date: '', time: '', iso: '' },
			end: { date: '', time: '', iso: '' },
		},
		'America/New_York': {
			start: { date: '', time: '', iso: '' },
			end: { date: '', time: '', iso: '' },
		},
		'America/Tegucigalpa': {
			start: { date: '', time: '', iso: '' },
			end: { date: '', time: '', iso: '' },
		},
	});

	const [showStartTooltip, setShowStartTooltip] = useState<boolean>(false);
	const [showEndTooltip, setShowEndTooltip] = useState<boolean>(false);

	const convertToUTC = (date: string): string => {
		return formatISOForTimeZone(new Date(date), 'UTC');
	};
	const [image, setImage] = useState<File | null>(null);



	const register = async () => {
		const { scheduledStart, scheduledEnd, timeZone } = formData;

		const scheduledStartUTC = convertToUTC(scheduledStart);
		const scheduledEndUTC = convertToUTC(scheduledEnd);


		    // Create a FormData object
			const formDataToSend = new FormData();
			formDataToSend.append('name', formData.name);
			formDataToSend.append('email', formData.email);
			formDataToSend.append('password', formData.password);
			formDataToSend.append('timeZone', formData.timeZone);
			formDataToSend.append('role', formData.role);
			formDataToSend.append('scheduledStart', scheduledStartUTC);
			formDataToSend.append('scheduledEnd', scheduledEndUTC);

		// Log the selected image to the console
		if (image) {
			formDataToSend.append('image', image);
			console.log('Selected image:', image);
		}
		try {
			const res = await fetch(`${SERVER_URL}/auth-v2/register`, {
				method: 'POST',
				body: formDataToSend,
			});

			if (!res.ok) {
				const errorText = await res.text();
				alert(`Error: ${errorText}`);
				return;
			}

			const response = await res.json();
			alert('User Registered!');
		} catch (error) {
			console.error('Registration error:', error);
			alert('An error occurred during registration. Please try again.');
		}
	};
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		if (name === 'scheduledStart') {
			updateFormattedDateTime(value, formData.timeZone, 'start');
		} else if (name === 'scheduledEnd') {
			updateFormattedDateTime(value, formData.timeZone, 'end');
		}
	};

	const updateFormattedDateTime = (
		dateTime: string,
		timeZone: string,
		type: 'start' | 'end'
	): void => {
		if (dateTime) {
			const date = new Date(dateTime);
			const updatedFormattedDateTime: { [key: string]: TimeZoneData } =
				{};

			timezones.forEach((tz) => {
				updatedFormattedDateTime[tz.zone] = {
					date: formatDateForTimeZone(date, tz.zone),
					time: formatTimeForTimeZone(date, tz.zone),
					iso: formatISOForTimeZone(date, tz.zone),
				};
			});

			setFormattedDateTime((prev) => ({
				...prev,
				[timeZone]: {
					...prev[timeZone],
					[type]: updatedFormattedDateTime[timeZone],
				},
				...Object.keys(updatedFormattedDateTime).reduce(
					(acc, zone) => ({
						...acc,
						[zone]: {
							...prev[zone],
							[type]: updatedFormattedDateTime[zone],
						},
					}),
					{}
				),
			}));
		} else {
			const emptyFormattedDateTime = { date: '', time: '', iso: '' };
			setFormattedDateTime((prev) => ({
				...prev,
				[timeZone]: {
					...prev[timeZone],
					[type]: emptyFormattedDateTime,
				},
				...Object.keys(prev).reduce(
					(acc, zone) => ({
						...acc,
						[zone]: {
							...prev[zone],
							[type]: emptyFormattedDateTime,
						},
					}),
					{}
				),
			}));
		}
	};

	return (
		<div className="m-2 border rounded overflow-hidden shadow">
			<div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600">
				Sign Up
			</div>
			<div className="p-2 flex flex-col gap-6 relative">
				<InputBox
					autoComplete="off"
					name="name"
					labelText="Name"
					required
					onChange={handleChange}
				/>
				<InputBox
					name="email"
					labelText="Email"
					required
					onChange={handleChange}
				/>
				<InputBox
					name="password"
					labelText="Password"
					type="password"
					required
					onChange={handleChange}
				/>
				<TimezoneDropdown
					selectedTimeZone={formData.timeZone}
					handleTimeZoneChange={(e) => {
						setFormData({
							...formData,
							timeZone: e.target.value,
						});

						setSelectedTimeZone(e.target.value);
					}}
				/>
				<div className="mb-4">
					<label
						htmlFor="role"
						className="block text-sm font-medium text-gray-700">
						Role
					</label>
					<select
						id="role"
						name="role"
						value={formData.role}
						onChange={handleChange}
						className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
						<option value="USER">User</option>
						<option value="ADMIN">Admin</option>
					</select>
				</div>
				<div className="relative">
					<InputBox
						name="scheduledStart"
						labelText="Scheduled Start Time"
						type="datetime-local"
						required
						onChange={handleChange}
						onFocus={() => setShowStartTooltip(true)}
						onBlur={() => setShowStartTooltip(false)}
					/>
					<Tooltip
						content={
							<>
								<div>
									<strong>
										Start Time Formatted Date and Time:
									</strong>
								</div>
								<h6>Timezones</h6>

								{timezones.map((tz) => (
									<div key={tz.zone}>
										{tz.name} Start:{' '}
										{formattedDateTime[tz.zone]?.start
											.date || 'N/A'}
										<br />
									</div>
								))}
								<h6>Iso Strings</h6>

								{timezones.map((tz) => (
									<div key={tz.zone}>
										{tz.name} Start:{' '}
										{formattedDateTime[tz.zone]?.start
											.iso || 'N/A'}
									</div>
								))}
							</>
						}
						visible={showStartTooltip}
					/>
				</div>
				<div className="relative">
					<InputBox
						name="scheduledEnd"
						labelText="Scheduled End Time"
						type="datetime-local"
						required
						onChange={handleChange}
						onFocus={() => setShowEndTooltip(true)}
						onBlur={() => setShowEndTooltip(false)}
					/>
					<Tooltip
						content={
							<>
								<div>
									<strong>
										End Time Formatted Date and Time:
									</strong>
								</div>
								{timezones.map((tz) => (
									<div key={tz.zone}>
										{tz.name} End:{' '}
										{formattedDateTime[tz.zone]?.end.date ||
											'N/A'}
										<br />
									</div>
								))}
								<h6>Iso Strings</h6>

								{timezones.map((tz) => (
									<div key={tz.zone}>
										{tz.name} End:{' '}
										{formattedDateTime[tz.zone]?.end.iso ||
											'N/A'}
									</div>
								))}
							</>
						}
						visible={showEndTooltip}
					/>
				</div>
				<div>
					<label
						htmlFor="image"
						className="block text-sm font-medium text-gray-700">
						Upload Image
					</label>
					<input
						type="file"
						id="image"
						name="image"
						accept="image/*"
						onChange={handleFileChange}
						className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div className="flex justify-center items-center gap-2">
					<Button onClick={register}>Submit</Button>
					<Link href={'/dashboard'}>Cancel</Link>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
