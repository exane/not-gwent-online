<?php

namespace Gwent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class Request extends FormRequest
{

  /**
   * @var
   */
  private $userID;

  /**
   * @var
   */
  private $accessPoint;

  public function __construct($userID, $accessPoint)
    {

      $this->userID = $userID;
      $this->accessPoint = $accessPoint;
    }
}
