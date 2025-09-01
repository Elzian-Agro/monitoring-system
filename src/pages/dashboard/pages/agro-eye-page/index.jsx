import React, { useState, useEffect } from 'react';
import { IconButton, VariantButton } from '../../components/base/Button';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import From from './agro-eye-form';
import Chart from './chart';
import Loader from '../../components/common/loader';
import Modal from 'components/common/modal';
import useFetch from 'hooks/useFetch';
import useAxios from 'hooks/useAxios';
import { useTranslation } from 'react-i18next';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { messages } from 'utils/constant';

const AgroEye = () => {
  const [message, setMessage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const { t } = useTranslation();
  const { send } = useAxios();
  const {
    response: widgets,
    recall,
    isLoading,
  } = useFetch({
    endpoint: 'widget',
    method: 'GET',
    call: 1,
    requestBody: {},
    dependency: [],
  });
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState([]);

  useEffect(() => {
    const order = widgets?.map((widget) => widget.order)?.sort((a, b) => a - b) ?? [0];
    setItems(order);
  }, [widgets]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);

      const updatedWidgets = newOrder.map((id, index) => ({
        ...widgets.find((widget) => widget.order === id),
        order: index + 1,
      }));

      updatedWidgets.forEach(async (widget) => {
        await send({
          endpoint: `widget/${widget._id}`,
          method: 'PUT',
          body: { order: widget.order },
        });
      });
    }
  }

  // Handle confiation and delete
  const handleConfirmationAndDelete = async (result) => {
    if (result) {
      const response = await send({
        endpoint: `widget/${selectedWidget._id}`,
        method: 'DELETE',
        body: { isDeleted: true },
      });
      setIsConfirmVisible(false);
      if (response) {
        setMessage(messages.widgetDeleted);
        setIsAlertVisible(true);
        setItems((items) => items.filter((id) => id !== selectedWidget.order));
      }
    }
    setSelectedWidget(null);
    setIsConfirmVisible(false);
  };

  return (
    <div className='mx-5 mt-2'>
      {isFormVisible && (
        <From
          visible={isFormVisible}
          widget={selectedWidget}
          higherOrder={items[items.length - 1]}
          onClose={() => {
            setSelectedWidget(null);
            setIsFormVisible(false);
          }}
          formSubmission={async (message) => {
            setSelectedWidget(null);
            setMessage(message);
            setIsAlertVisible(true);
            recall();
          }}
        />
      )}

      {isLoading && (
        <div className='h-[90vh]'>
          <Loader />
        </div>
      )}

      {!isFormVisible && !isLoading && (
        <div className='flex flex-col shadow-lg bg-white dark:bg-secondary-dark-bg rounded-lg p-6'>
          <div className='flex justify-end'>
            <VariantButton
              text='Add New'
              Icon={PlusIcon}
              onClick={() => {
                setIsFormVisible(true);
              }}
            />
          </div>

          <div className='mt-6'>
            {widgets && widgets.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((id) => {
                      // Find the widget with the corresponding id
                      const widget = widgets.find((widget) => widget.order === id);

                      return (
                        <div key={id}>
                          <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
                            <div className='flex justify-end gap-2 mr-2 py-2'>
                              <IconButton
                                testid='update-button'
                                color='text-blue-600'
                                Icon={PencilSquareIcon}
                                onClick={() => {
                                  setSelectedWidget(widget);
                                  setIsFormVisible(true);
                                }}
                              />
                              <IconButton
                                testid='delete-button'
                                color='text-red-600'
                                Icon={TrashIcon}
                                onClick={() => {
                                  setSelectedWidget(widget);
                                  setIsConfirmVisible(true);
                                }}
                              />
                            </div>
                            <Chart key={id} id={id} widget={widget} />
                          </div>
                        </div>
                      );
                    })}
                  </SortableContext>
                </div>
              </DndContext>
            ) : (
              <div className='flex justify-center dark:text-white'>{t('Widgets not found')}</div>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={isConfirmVisible}
        message={messages.confirmDelete}
        onClose={(result) => handleConfirmationAndDelete(result)}
        type='confirmation'
      />
      <Modal
        isOpen={isAlertVisible}
        message={`${message}`}
        onClose={() => {
          setIsAlertVisible(false);
        }}
        type='alert'
      />
    </div>
  );
};

export default AgroEye;
