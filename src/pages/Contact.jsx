import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const CONTACT_METHODS = [
  {
    name: 'Email',
    description: 'Send us an email anytime',
    email: 'support@tokblog.com',
    icon: EnvelopeIcon
  },
  {
    name: 'Phone',
    description: 'Mon-Fri from 8am to 5pm',
    phone: '+232 99 999 999',
    icon: PhoneIcon
  },
  {
    name: 'Office',
    description: 'Come say hello',
    address: '7 Wilkinson Road, Freetown, Sierra Leone',
    icon: MapPinIcon
  }
];

export default function Contact() {
  const { user } = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      console.log('Sending message:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      reset();
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="relative bg-primary-800 dark:bg-primary-700 transition-colors duration-200">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 dark:bg-gray-800" />
        </div>
        <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-2">
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-lg">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                Get in touch
              </h1>
              <p className="mt-3 text-lg leading-6 text-gray-500 dark:text-gray-400">
                We'd love to hear from you! Send us a message using the form or contact us using the information below.
              </p>
              <dl className="mt-8 space-y-6">
                {CONTACT_METHODS.map((method) => (
                  <div key={method.name} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500">
                        <method.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <dt className="text-base font-medium text-gray-900 dark:text-gray-100">{method.name}</dt>
                      <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <p>{method.description}</p>
                        {method.email && (
                          <a href={`mailto:${method.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                            {method.email}
                          </a>
                        )}
                        {method.phone && (
                          <a href={`tel:${method.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                            {method.phone}
                          </a>
                        )}
                        {method.address && (
                          <p>{method.address}</p>
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="bg-primary-800 dark:bg-primary-700 px-6 py-16 lg:px-8 lg:py-24 transition-colors duration-200">
            <div className="mx-auto max-w-lg lg:mr-0 lg:ml-auto">
              <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-lg transition-colors duration-200">
                <h2 className="sr-only">Contact form</h2>

                <div className="px-6 py-10">
                  {submitSuccess && (
                    <div className="mb-6 rounded-md bg-green-50 dark:bg-green-900 p-4">
                      <div className="text-sm text-green-700 dark:text-green-400">
                        Message sent successfully! We'll get back to you soon.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Name"
                      {...register('name', {
                        required: 'Name is required'
                      })}
                      error={errors.name?.message}
                      className="dark:bg-gray-800 dark:text-gray-100"
                    />

                    <Input
                      label="Email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors.email?.message}
                      className="dark:bg-gray-800 dark:text-gray-100"
                    />

                    <Input
                      label="Subject"
                      {...register('subject', {
                        required: 'Subject is required'
                      })}
                      error={errors.subject?.message}
                      className="dark:bg-gray-800 dark:text-gray-100"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Message
                      </label>
                      <textarea
                        {...register('message', {
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters'
                          }
                        })}
                        rows={4}
                        className={`mt-1 block w-full rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-100
                          ${errors.message
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600'
                          }`}
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white"
                      isLoading={isSubmitting}
                    >
                      Send message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
