<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'token', 'pipefy_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function getUserToken($email)
    {
        $select = self::select('token')->where('email', '=', $email)->first();
        return (!is_null($select)) ? $select->token : null;
    }

    public function team()
    {
        return $this->belongsToMany(PipefyUser::class, 'teams', 'user_id', 'pipefy_id')->withPivot('status')->where('teams.status', '>', 0)->orderBy('order');
    }

    public function teamActive()
    {
        return $this->belongsToMany(PipefyUser::class, 'teams', 'user_id', 'pipefy_id')->withPivot('status')->where('teams.status', '=', 2)->orderBy('order');
    }

    public function pipefyUser()
    {
        return $this->belongsTo(PipefyUser::class, 'pipefy_id');
    }

    public function filters()
    {
        return $this->hasMany(Filters::class, 'user_id');
    }

    public function is_manager()
    {
        return (count($this->team) > 0);
    }
}
